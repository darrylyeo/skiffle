// Types
import { type Handle } from '@sveltejs/kit'


// Rendering
import satori from 'satori'
import { html as toReactNode } from 'satori-html'
import { Resvg } from '@resvg/resvg-js'

type SatoriNode = ReturnType<typeof toReactNode>

const childrenOf = (node: SatoriNode) => (
	(
		(c) => (
			c === undefined ? []
			: typeof c === 'string' ? []
			: Array.isArray(c) ? c
			: [c]
		)
	)(node.props.children)
)

const findTag = (node: SatoriNode, type: string) => (
	childrenOf(node).find((child) => child?.type === type)
)


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
	wantsSnapJson,
} from './lib/snap'
import { snapGetResponse, snapPostResponse } from './lib/snap-routes'


// Hooks
export const handle: Handle = async ({
	event,
	resolve,
}) => {
	const contentTypes = event.request.headers.get('accept')

	console.info('event', event)

	console.info('\nHANDLE\n' + event.url.pathname, event.route, {
		url: event.url,
		method: event.request.method,
		contentTypes,
		isDataRequest: event.isDataRequest,
		isSubRequest: event.isSubRequest,
	})

	// Image redirect
	if(event.url.searchParams.has('frameImage')) {
		console.info('Redirect to image generator from `frameImage` query parameter...')

		const url = new URL(event.url)

		url.searchParams.delete('frameImage')

		return event.fetch(url, {
			method: 'GET',
			headers: new Headers({
				'accept': 'image/png',
			}),
		})
	}

	// Farcaster Snap (content negotiation)
	if (event.request.method === 'GET' && wantsSnapJson(event.request)) {
		const snap = await snapGetResponse(event, resolve)
		if (snap) {
			return snap
		}
	}

	// Svelte → HTML → Image
	if (
		event.request.method === 'GET'
		&& (contentTypes && contentTypes.includes('image/') && !contentTypes.includes('text/html') && !contentTypes.includes('*/*'))
	) {
		console.info(event.url.pathname, 'Rendering Svelte → HTML...')

		const response = await resolve(event)

		if(response.status !== 200) {
			const result = await response.clone().text()
			console.error('Error rendering Svelte → HTML:', result)
			return response
		}

		console.info(event.url.pathname, 'Rendering HTML → SVG...')

		const html = await response.text()

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

		const reactNode = toReactNode(`<style>${styles.join('\n')}</style>${html}`)

		const htmlEl = findTag(reactNode, 'html')
		const bodyEl = htmlEl && findTag(htmlEl, 'body')
		const divEl = bodyEl && findTag(bodyEl, 'div')
		const contentRoot = (
			(divEl && childrenOf(divEl).find((child) => Boolean(child)))
			?? divEl
			?? bodyEl
			?? htmlEl
			?? reactNode
		)

		const style = contentRoot.props.style
		if (style === undefined) {
			throw new Error('expected frame content root to declare width and height')
		}
		const width = Number(style.width.match(/\d+/)![0])
		const height = Number(style.height.match(/\d+/)![0])

		const svg = await satori(
			contentRoot,
			{
				fonts,
				width,
				height,
			}
		)
		console.info(event.url.pathname, 'Rendering SVG → PNG...')

		const png = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: width,
			}
		})
			.render()
			.asPng()

		console.info(event.url.pathname, 'Rendered.')

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
			console.info('Frame Button Action')

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
				console.info('Handling with SvelteKit Form Action...')

				const { data } = deserialize(await response.text()) as { data: { frame: FrameMeta } }

				console.info('Frame:', data.frame)

				if (!data.frame.image.url) {
					const frameImageUrl = new URL(event.url)
					frameImageUrl.searchParams.set('frameImage', '')
					data.frame.image.url = frameImageUrl.href
				}

				return createFrameResponse(data.frame, event.request.url)
			}

			console.info('Handling with SvelteKit GET request...')
			event.request = new Request(
				event.request.url,
				{
					method: 'GET',
					headers: event.request.headers,
				},
			)

			return await resolve(event)
		}

		if (isLikelyJfsCompact(bodyText) || hasSnapJfsEnvelope(bodyText)) {
			try {
				const payload = await readSnapJfsPayload(bodyText.trim())
				event.locals.farcasterViewerFid = payload.fid
				const snapRes = await snapPostResponse(event, resolve, payload)
				if (snapRes) {
					return snapRes
				}
			} catch (err) {
				console.error('Snap JFS error', err)
				return new Response('Unauthorized', { status: 401 })
			}
			return new Response('Snap POST not supported for this URL', { status: 404 })
		}

		event.request = new Request(
			event.request.url,
			{
				method: 'POST',
				headers: event.request.headers,
				body: bodyText,
			},
		)

		return await resolve(event)
	}

	return await resolve(event)
}
