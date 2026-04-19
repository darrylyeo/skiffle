// Types
import type { Handle, RequestEvent } from '@sveltejs/kit'

import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'

import { deserialize } from '$app/forms'

import { parseAppSnapFromHtml } from '$/lib/snap-components'
import type { SnapJfsPayload } from '$/lib/snap-jfs'
import {
	framePageToSnap,
	snapResolvedUrl,
	type FramePage,
} from '$/lib/snap'
import { SnapMediaType } from '$/lib/snap-spec'
import { resolveUrl } from '$/lib/resolveUrl'

type Resolve = Parameters<Handle>[0]['resolve']

/**
 * SvelteKit form actions use `?/actionName` (search param key `/actionName`, often empty value).
 * Prefer `url.search` because some stacks parse `?/…` inconsistently for `URLSearchParams`.
 */
const isSvelteKitInternalActionUrl = (url: URL) => {
	const q = url.search
	if (q.startsWith('?/') && q.length > 2) {
		return true
	}
	return [...url.searchParams.keys()].some((key) => (
		key.startsWith('/')
		&& key.length > 1
	))
}

const htmlRequest = (request: Request) => {
	const headers = new Headers(request.headers)
	headers.set('accept', 'text/html')

	return new Request(
		request.url,
		{
			method: 'GET',
			headers,
		},
	)
}

const frameImageUrlForRequest = (url: URL | string) => {
	const frameImageUrl = new URL(String(url))
	frameImageUrl.searchParams.set('frameImage', '')
	return frameImageUrl.href
}

type SnapRouteData = {
	title?: string
	frame?: FrameMeta
	snap?: AppSnapPage
	gotoUrl?: string
}

const SNAP_CORS_ALLOW_HEADERS = 'Accept, Content-Type'
const SNAP_CORS_ALLOW_METHODS = 'GET, POST, OPTIONS'

export const snapCorsHeaders = (
	headers?: HeadersInit,
) => {
	const nextHeaders = new Headers(headers)

	nextHeaders.set('access-control-allow-origin', '*')
	nextHeaders.set('access-control-allow-methods', SNAP_CORS_ALLOW_METHODS)
	nextHeaders.set('access-control-allow-headers', SNAP_CORS_ALLOW_HEADERS)

	const vary = nextHeaders.get('vary')
	nextHeaders.set(
		'vary',
		[
			...(vary?.split(',').map((value) => value.trim()).filter(Boolean) ?? []),
			'Origin',
		]
			.filter((value, index, values) => values.indexOf(value) === index)
			.join(', '),
	)

	return nextHeaders
}

export const snapOptionsResponse = () => (
	new Response(
		null,
		{
			status: 204,
			headers: snapCorsHeaders(),
		},
	)
)

const decodeHtml = (value: string) => (
	value
		.replaceAll('&quot;', '"')
		.replaceAll('&amp;', '&')
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
)

const FRAME_BUTTON_ACTIONS = [
	'post',
	'post_redirect',
	'link',
	'mint',
	'tx',
] as const

const parseFrameButtonAction = (value: string | undefined) => (
	FRAME_BUTTON_ACTIONS.find((action) => action === value)
)

const parseFrameVersion = (value: string | undefined): FrameMeta['version'] | undefined => (
	value === 'vNext' || /^\d+-\d+-\d+$/.test(value ?? '')
		? value as FrameMeta['version']
		: undefined
)

const parseFrameAspectRatio = (value: string | undefined): FrameMeta['image']['aspectRatio'] | undefined => (
	value === '1:1' || value === '1.91:1'
		? value
		: undefined
)

const metaPropertyMap = (html: string) => {
	const properties: Record<string, string> = {}
	for (const [, attrs] of html.matchAll(/<meta\s+([^>]+)>/gi)) {
		const property = (
			attrs.match(/\bproperty\s*=\s*"([^"]+)"/i)
			?? attrs.match(/\bproperty\s*=\s*'([^']+)'/i)
		)?.[1]
		const contentRaw = (
			attrs.match(/\bcontent\s*=\s*"([^"]*)"/i)
			?? attrs.match(/\bcontent\s*=\s*'([^']*)'/i)
		)?.[1]
		if (property && contentRaw !== undefined) {
			properties[property] = decodeHtml(contentRaw)
		}
	}
	return properties
}

const parseFramePageFromHtml = (
	html: string,
): FramePage | undefined => {
	const properties = metaPropertyMap(html)

	const imageUrl = properties['fc:frame:image']
	if (!imageUrl) {
		return undefined
	}

	const buttonFromMeta = (buttonIndex: 1 | 2 | 3 | 4) => {
		const label = properties[`fc:frame:button:${buttonIndex}`]
		return label
			? {
				label,
				action: parseFrameButtonAction(properties[`fc:frame:button:${buttonIndex}:action`]),
				targetUrl: properties[`fc:frame:button:${buttonIndex}:target`],
			}
			: undefined
	}

	const title = html.match(/<title>([^<]+)<\/title>/)?.[1]

	return {
		title: title ? decodeHtml(title) : undefined,
		frame: {
			version: parseFrameVersion(properties['fc:frame']),
			image: {
				url: imageUrl,
				aspectRatio: parseFrameAspectRatio(properties['fc:frame:image:aspect_ratio']),
			},
			postUrl: properties['fc:frame:post_url'],
			textInput: properties['fc:frame:input:text'],
			buttons: [
				buttonFromMeta(1),
				buttonFromMeta(2),
				buttonFromMeta(3),
				buttonFromMeta(4),
			],
			state: (() => {
				try {
					return properties['fc:frame:state']
						? JSON.parse(properties['fc:frame:state'])
						: undefined
				} catch {
					return undefined
				}
			})(),
		},
		snap: parseAppSnapFromHtml(html),
	}
}

const createSnapResponse = (
	body: ReturnType<typeof framePageToSnap>,
	requestUrl: URL,
) => {
	const self = resolveUrl(requestUrl.pathname + requestUrl.search, requestUrl)
	const link = (
		`<${self}>; rel="alternate"; type="${SnapMediaType}", `
		+ `<${self}>; rel="alternate"; type="text/html"`
	)
	return new Response(
		JSON.stringify(body),
		{
			status: 200,
			headers: snapCorsHeaders({
				'content-type': SnapMediaType,
				'vary': 'Accept',
				'link': link,
			}),
		},
	)
}

const mergeVaryToken = (existing: string | null, token: string) => (
	[
		...(existing?.split(',').map((value) => value.trim()).filter(Boolean) ?? []),
		token,
	]
		.filter((value, index, values) => values.indexOf(value) === index)
		.join(', ')
)

/** @see https://docs.farcaster.xyz/snap/http-headers#link-responses */
export const withSnapHtmlDiscovery = (
	response: Response,
	requestUrl: URL,
	html: string,
) => {
	if (!parseFramePageFromHtml(html)) {
		return new Response(html, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
		})
	}
	const self = resolveUrl(requestUrl.pathname + requestUrl.search, requestUrl)
	const link = `<${self}>; rel="alternate"; type="${SnapMediaType}"`
	const headers = new Headers(response.headers)
	const existingLink = headers.get('link')
	headers.set(
		'link',
		existingLink
			? `${existingLink}, ${link}`
		: link,
	)
	headers.set('vary', mergeVaryToken(headers.get('vary'), 'Accept'))
	return new Response(html, {
		status: response.status,
		statusText: response.statusText,
		headers,
	})
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
	typeof value === 'object'
	&& value !== null
)

const isFrameMetaLike = (value: unknown): value is FrameMeta => (
	isRecord(value)
	&& isRecord(value.image)
)

const isAppSnapPageLike = (value: unknown): value is AppSnapPage => (
	isRecord(value)
)

const snapRouteDataFromActionResult = (value: unknown): SnapRouteData | undefined => {
	if (
		!value
		|| typeof value !== 'object'
		|| !('data' in value)
		|| !value.data
		|| typeof value.data !== 'object'
	) {
		return undefined
	}

	const data = value.data
	const title = 'title' in data ? data.title : undefined
	const frame = 'frame' in data ? data.frame : undefined
	const snap = 'snap' in data ? data.snap : undefined
	const gotoUrl = 'gotoUrl' in data ? data.gotoUrl : undefined

	return {
		...(typeof title === 'string' ? { title } : {}),
		...(isFrameMetaLike(frame) ? { frame } : {}),
		...(isAppSnapPageLike(snap) ? { snap } : {}),
		...(typeof gotoUrl === 'string' ? { gotoUrl } : {}),
	}
}

const mergeRouteDataIntoPage = (
	framePage: FramePage | undefined,
	data: SnapRouteData,
	baseUrl: URL | string,
): FramePage | undefined => {
	const frame = data.frame
		? {
			...framePage?.frame,
			...data.frame,
			image: {
				...framePage?.frame.image,
				...data.frame.image,
				url: snapResolvedUrl(
					resolveUrl(
						data.frame.image.url || framePage?.frame.image.url || frameImageUrlForRequest(baseUrl),
						baseUrl,
					),
					baseUrl,
				),
			},
		}
		: framePage?.frame

	return frame
		? {
			title: data.title ?? framePage?.title,
			frame,
			snap: data.snap ?? framePage?.snap,
		}
		: undefined
}

const resolveFramePage = async (
	event: RequestEvent,
	resolve: Resolve,
	overrideData?: SnapRouteData,
) => {
	event.request = htmlRequest(event.request)

	const response = await resolve(event)
	if (!response.ok) {
		return undefined
	}

	const framePage = parseFramePageFromHtml(await response.text())
	if (!framePage && !overrideData) {
		return undefined
	}

	return overrideData
		? mergeRouteDataIntoPage(framePage, overrideData, event.request.url)
		: framePage
}

const resolveFramePageFromUrl = async (
	fetch: RequestEvent['fetch'],
	url: URL | string,
) => {
	const response = await fetch(
		String(url),
		{
			headers: {
				accept: 'text/html',
			},
		},
	)

	if (!response.ok) {
		return undefined
	}

	return parseFramePageFromHtml(await response.text())
}

export const snapGetResponse = async (
	event: RequestEvent,
	resolve: Resolve,
) => {
	const framePage = await resolveFramePage(event, resolve)
	return framePage
		? createSnapResponse(framePageToSnap(framePage, event.url), event.url)
		: null
}

export const snapPostResponse = async (
	event: RequestEvent,
	resolve: Resolve,
	payload: SnapJfsPayload,
) => {
	if (isSvelteKitInternalActionUrl(event.url)) {
		const formBody = new URLSearchParams(
			Object.entries(payload.inputs ?? {}).map(([key, value]) => (
				[
					key,
					typeof value === 'string'
						? value
						: JSON.stringify(value),
				]
			)),
		)

		event.request = new Request(
			event.request.url,
			{
				method: 'POST',
				headers: (() => {
					const headers = new Headers(event.request.headers)
					headers.set('content-type', 'application/x-www-form-urlencoded; charset=UTF-8')
					headers.set('accept', 'application/json')
					headers.set('x-sveltekit-action', 'true')
					headers.set('origin', new URL(event.request.url).origin)
					return headers
				})(),
				body: formBody.toString(),
			},
		)

		const response = await resolve(event)
		if (response.ok) {
			try {
				const data = snapRouteDataFromActionResult(deserialize(await response.text()))

				if (data?.gotoUrl) {
					const targetUrl = new URL(data.gotoUrl, event.url)
					const framePage = await resolveFramePageFromUrl(event.fetch, targetUrl)

					return framePage
						? createSnapResponse(framePageToSnap(framePage, targetUrl), targetUrl)
						: null
				}

				if (data?.frame || data?.snap || data?.title) {
					const framePage = await resolveFramePage(event, resolve, data)
					return framePage
						? createSnapResponse(framePageToSnap(framePage, event.url), event.url)
						: null
				}
			} catch {
				/* fall through to GET-based rendering */
			}
		}
	}

	const framePage = await resolveFramePage(event, resolve)
	return framePage
		? createSnapResponse(framePageToSnap(framePage, event.url), event.url)
		: null
}
