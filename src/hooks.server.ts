// Types
import { type Handle } from '@sveltejs/kit'
import { existsSync, readFileSync } from 'fs'

import type { JSXElement } from 'satori/jsx'


// Rendering
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { html as htmlToVNode } from 'satori-html'
import twemoji from 'twemoji'

type SatoriNode = JSXElement

const styledHtmlDocumentForSatori = (
	styleText: string,
	fullPageHtml: string,
): JSXElement => (
	htmlToVNode(`<style>${styleText}</style>${fullPageHtml}`)
)

const installedTwemojiSvgPath = (code: string) => (
	`${process.cwd()}/node_modules/@datawrapper/twemoji-svg/svg/${code}.svg`
)

const dataUrlFromSvg = (svg: string) => (
	`data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`
)

const emojiCache = new Map<string, string>()
const missingEmojiCache = new Set<string>()
const fontCache = new Map<string, {
	name: string,
	data: ArrayBuffer,
	style: 'normal',
	weight: 400,
	lang?: string,
}[]>()

const fontArrayBuffer = (pkg: string, file: string) => {
	const buffer = readFileSync(`${process.cwd()}/node_modules/${pkg}/files/${file}`)
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

const installedEmojiSvg = (code: string) => (
	existsSync(installedTwemojiSvgPath(code))
		? readFileSync(installedTwemojiSvgPath(code), 'utf8')
		: undefined
)

const cacheFonts = (
	key: string,
	fonts: {
		name: string,
		data: ArrayBuffer,
		style: 'normal',
		weight: 400,
		lang?: string,
	}[],
) => (
	fontCache.set(key, fonts),
	fonts
)

const japaneseFallbackFonts = () => (
	fontCache.get('ja-JP')
		?? cacheFonts(
			'ja-JP',
			[
				{
					name: 'Noto Sans JP',
					data: fontArrayBuffer('@fontsource/noto-sans-jp', 'noto-sans-jp-japanese-400-normal.woff'),
					style: 'normal',
					weight: 400,
					lang: 'ja-JP',
				},
			],
		)
)

const symbolFallbackFonts = () => (
	fontCache.get('unknown')
		?? cacheFonts(
			'unknown',
			[
				{
					name: 'Noto Sans Symbols 2',
					data: fontArrayBuffer('@fontsource/noto-sans-symbols-2', 'noto-sans-symbols-2-symbols-400-normal.woff'),
					style: 'normal',
					weight: 400,
				},
			],
		)
)

const twemojiCodeFromSegment = (segment: string) => (
	twemoji.convert
		.toCodePoint(segment)
		.split('-')
		.filter((code) => (
			code !== 'fe0f'
		))
		.join('-')
)

const emojiLikeSegmentPattern = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1f3fb}-\u{1f3ff}\u200d\u20e3\u{e0020}-\u{e007f}]/u

const isEmojiSegment = (
	languageCode: string,
	segment: string,
) => (
	languageCode === 'emoji'
	|| emojiLikeSegmentPattern.test(segment)
)

const emojiDataUrlForSegment = async (segment: string) => {
	if (missingEmojiCache.has(segment)) {
		return undefined
	}

	const cached = emojiCache.get(segment)
	if (cached) {
		return cached
	}

	const code = twemojiCodeFromSegment(segment)
	if (!code) {
		missingEmojiCache.add(segment)
		return undefined
	}

	const localSvg = installedEmojiSvg(code)
	if (localSvg) {
		const dataUrl = dataUrlFromSvg(localSvg)
		emojiCache.set(segment, dataUrl)
		return dataUrl
	}

	missingEmojiCache.add(segment)
	return undefined
}

const loadSatoriAdditionalAsset = async (
	languageCode: string,
	segment: string,
) => {
	if (isEmojiSegment(languageCode, segment)) {
		const dataUrl = await emojiDataUrlForSegment(segment)
		if (dataUrl) {
			return dataUrl
		}
	}

	if (languageCode === 'ja-JP' || /[\u3000-\u30ff\u4e00-\u9fff]/.test(segment)) {
		return japaneseFallbackFonts()
	}

	if (languageCode === 'unknown' || isEmojiSegment(languageCode, segment) || /[\u2190-\u2bff\u0336]/.test(segment)) {
		return symbolFallbackFonts()
	}

	return undefined
}

const wantsSnapJson = (request: Request) => (
	(request.headers.get('accept') ?? '')
		.includes(SnapMediaType)
)

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
import { snapGetResponse, snapPostResponse } from './lib/snap-routes'
import { SnapMediaType } from './lib/snap-spec'


// Hooks
export const handle: Handle = async ({
	event,
	resolve,
}) => {
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
		const response = await resolve(event)

		if (response.status !== 200) {
			const result = await response.clone().text()
			console.error('Error rendering Svelte → HTML:', result)
			return response
		}

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

			return await resolve(event)
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
