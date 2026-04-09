// Types
import type { Handle, RequestEvent } from '@sveltejs/kit'

import type { FrameMeta } from '$/lib/frame'

import { deserialize } from '$app/forms'

import {
	createSnapResponse,
	framePageToSnap,
	parseFramePageFromHtml,
	snapResolvedUrl,
	type FramePage,
	type SnapJfsPayload,
} from '$/lib/snap'
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

const mergeFrameIntoPage = (
	framePage: FramePage | undefined,
	frame: FrameMeta,
	baseUrl: URL | string,
): FramePage => ({
	title: framePage?.title,
	frame: {
		...framePage?.frame,
		...frame,
		image: {
			...framePage?.frame.image,
			...frame.image,
			url: snapResolvedUrl(
				resolveUrl(
					frame.image.url || framePage?.frame.image.url || frameImageUrlForRequest(baseUrl),
					baseUrl,
				),
				baseUrl,
			),
		},
	},
})

const resolveFramePage = async (
	event: RequestEvent,
	resolve: Resolve,
	overrideFrame?: FrameMeta,
) => {
	event.request = htmlRequest(event.request)

	const response = await resolve(event)
	if (!response.ok) {
		return undefined
	}

	const framePage = parseFramePageFromHtml(await response.text())
	if (!framePage && !overrideFrame) {
		return undefined
	}

	return overrideFrame
		? mergeFrameIntoPage(framePage, overrideFrame, event.request.url)
		: framePage
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
				const { data } = deserialize(await response.text()) as { data?: { frame?: FrameMeta } }
				if (data?.frame) {
					const framePage = await resolveFramePage(event, resolve, data.frame)
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
