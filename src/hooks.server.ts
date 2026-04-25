// Types
import { type Handle } from '@sveltejs/kit'

import type { JSXElement } from 'satori/jsx'


// Rendering
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { styledHtmlDocumentForSatori } from '$/lib/frame-satori'
import { loadSatoriAdditionalAsset } from '$/lib/satori-emoji'

type SatoriNode = JSXElement


// Fonts
import { fonts } from '$/styles/fonts'


// Styles
import css from '$/styles/app.css?raw'


// Form Actions
import { deserialize } from '$app/forms'


// Frames
import { createFrameResponse, type FrameMeta } from './lib/frame'


// Snaps
import {
	hasSnapJfsEnvelope,
	isLikelyJfsCompact,
	parseFrameSignatureJson,
	readSnapJfsPayload,
} from './lib/snap-jfs'
import { snapCorsHeaders, snapGetResponse, snapOptionsResponse, snapPostResponse } from './lib/snap-routes'
import { SnapMediaType } from './lib/snap-spec'


// Hooks
export const handle: Handle = async ({
	event,
	resolve,
}) => {
	const resolvedWithSnapAlternateLink = async () => {
		const resolved = await resolve(event)
		if (
			(resolved.headers.get('content-type') ?? '')
				.includes(SnapMediaType)
			|| !(resolved.headers.get('content-type') ?? '')
				.includes('text/html')
			|| resolved.headers.get('link')?.includes(`type="${SnapMediaType}"`)
		) {
			return resolved
		}

		const headers = new Headers(resolved.headers)
		const existingLink = headers.get('link')
		const snapLink = (
			`<${event.url.href}>; rel="alternate"; type="${SnapMediaType}"`
		)
		headers.set(
			'link',
			existingLink ? `${existingLink}, ${snapLink}` : snapLink,
		)
		headers.set(
			'vary',
			[
				...(headers.get('vary')?.split(',').map((value) => value.trim()).filter(Boolean) ?? []),
				'Accept',
			]
				.filter((value, index, values) => values.indexOf(value) === index)
				.join(', '),
		)
		return new Response(resolved.body, {
			status: resolved.status,
			statusText: resolved.statusText,
			headers,
		})
	}

	const contentTypes = event.request.headers.get('accept')

	// Image redirect
	if (event.url.searchParams.has('frameImage')) {
		const url = new URL(event.url)
		url.searchParams.delete('frameImage')
		return event.fetch(url, {
			method: 'GET',
			headers: new Headers({
				'accept': 'image/png',
			}),
		})
	}

	if (
		event.request.method === 'OPTIONS'
		&& (
			(event.request.headers.get('accept') ?? '')
				.includes(SnapMediaType)
			|| event.request.headers.has('access-control-request-method')
		)
	) {
		return snapOptionsResponse()
	}

	// Farcaster Snap (content negotiation) — MUST return snap JSON, never HTML
	// @see https://docs.farcaster.xyz/snap/http-headers
	if (
		event.request.method === 'GET'
		&& (event.request.headers.get('accept') ?? '')
			.includes(SnapMediaType)
	) {
		return await snapGetResponse(event, resolve)
	}

	// Svelte → HTML → Image
	if (
		event.request.method === 'GET'
		&& (contentTypes && contentTypes.includes('image/') && !contentTypes.includes('text/html') && !contentTypes.includes('*/*'))
	) {
		const response = await resolve(event)

		if (response.status !== 200) {
			const result = await response.clone().text()
			console.error('Error rendering Svelte → HTML:', result)
			return response
		}

		const html = await response.text()

		/** `JSXElement.props` is typed `unknown`; Satori vnode children match this shape at runtime. */
		const vnodeProps = (node: SatoriNode) => (
			node.props as {
				children?: unknown,
				style?: Record<string, string | undefined>,
			}
		)

		const childrenOf = (node: SatoriNode) => (
			(
				(c) => (
					c === undefined ? []
					: typeof c === 'string' ? []
					: Array.isArray(c) ? c
					: [c]
				)
			)(vnodeProps(node).children)
		)

		const findTag = (node: SatoriNode, type: string) => (
			childrenOf(node).find((child) => child?.type === type)
		)

		/** `html()` from satori-html always wraps the document in a synthetic root `div`; with `Fragment` + `<style>`, that wrapper is a sibling of `style`, not `html`. */
		const vnodeTreeForFrameExtract = (root: SatoriNode) => (
			(
				findTag(root, 'html')
					? root
					: childrenOf(root).find((child) => child?.type === 'div')
			)
			?? root
		)

		const stylesheetHrefs = [...new Set([
			...[...html.matchAll(/<link\s+href="([^"]+)"[^>]*rel="stylesheet"/gi)].map((m) => m[1]),
			...[...html.matchAll(/<link\s+rel="stylesheet"[^>]*href="([^"]+)"/gi)].map((m) => m[1]),
		])]
		const styles = [
			css,
			...await Promise.all(
				stylesheetHrefs.map(async (href) => {
					const response = await fetch(new URL(href, event.request.url).href)
					return response.text()
				})
			),
		]

		const reactNode = styledHtmlDocumentForSatori(styles.join('\n'), html)

		const extractRoot = vnodeTreeForFrameExtract(reactNode)
		const htmlEl = findTag(extractRoot, 'html')
		const bodyEl = htmlEl && findTag(htmlEl, 'body')
		const divEl = bodyEl && findTag(bodyEl, 'div')
		const contentRoot = (
			(divEl && childrenOf(divEl).find((child) => Boolean(child)))
			?? divEl
			?? bodyEl
			?? htmlEl
			?? reactNode
		)

		const style = vnodeProps(contentRoot).style
		if (
			style === undefined
			|| style.width === undefined
			|| style.height === undefined
		) {
			throw new Error('expected frame content root to declare width and height')
		}
		const width = Number(style.width.match(/\d+/)![0])
		const height = Number(style.height.match(/\d+/)![0])

		const svg = await satori(
			contentRoot,
			{
				fonts,
				loadAdditionalAsset: loadSatoriAdditionalAsset,
				width,
				height,
			}
		)

		const png = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: width,
			}
		})
			.render()
			.asPng()

		return new Response(
			new Uint8Array(png),
			{
				headers: {
					'content-type': 'image/png',
				},
			},
		)
	}

	// Frame POST (JSON signature packet) or Snap POST (JFS compact)
	if (event.request.method === 'POST') {
		const bodyText = await event.request.text()
		const frameSignaturePacket = parseFrameSignatureJson(bodyText)

		if (frameSignaturePacket) {
			event.locals.frameSignaturePacket = frameSignaturePacket
			event.locals.farcasterViewerFid = frameSignaturePacket.untrustedData.fid

			event.request = new Request(
				event.request.url,
				{
					method: 'POST',
					headers: (() => {
						const h = new Headers(event.request.headers)
						h.set('content-type', 'text/plain')
						return h
					})(),
					body: bodyText,
				},
			)

			const response = await resolve(event)

			if (response.ok) {
				const { data } = deserialize(await response.text()) as { data: { frame: FrameMeta } }

				if (!data.frame.image.url) {
					const frameImageUrl = new URL(event.url)
					frameImageUrl.searchParams.set('frameImage', '')
					data.frame.image.url = frameImageUrl.href
				}

				return createFrameResponse(data.frame, event.request.url)
			}

			event.request = new Request(
				event.request.url,
				{
					method: 'GET',
					headers: event.request.headers,
				},
			)

			return await resolvedWithSnapAlternateLink()
		}

		if (isLikelyJfsCompact(bodyText) || hasSnapJfsEnvelope(bodyText)) {
			try {
				const payload = await readSnapJfsPayload(bodyText.trim(), event.request.url)
				event.locals.farcasterViewerFid = payload.fid
				const snapRes = await snapPostResponse(event, resolve, payload)
				if (snapRes) {
					return snapRes
				}
			} catch (err) {
				console.error('Snap JFS error', err)
				return new Response(
					'Unauthorized',
					{
						status: 401,
						headers: snapCorsHeaders(),
					},
				)
			}
			return new Response(
				'Snap POST not supported for this URL',
				{
					status: 404,
					headers: snapCorsHeaders(),
				},
			)
		}

		event.request = new Request(
			event.request.url,
			{
				method: 'POST',
				headers: event.request.headers,
				body: bodyText,
			},
		)

		return await resolvedWithSnapAlternateLink()
	}

	return await resolvedWithSnapAlternateLink()
}
