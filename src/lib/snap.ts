// Farcaster Snaps
// https://docs.farcaster.xyz/snap


// Types/constants
import type { FrameButton, FrameMeta, FrameSignaturePacket } from '$/lib/frame'

import { decode, verify } from '@farcaster/jfs'

import { resolveUrl } from '$/lib/resolveUrl'

export const SNAP_MEDIA_TYPE = 'application/vnd.farcaster.snap+json' as const

export type SnapPaletteColor = (
	| 'purple'
	| 'blue'
	| 'green'
	| 'amber'
	| 'teal'
	| 'red'
	| 'pink'
	| 'gray'
)

export type SnapTheme = {
	accent?: SnapPaletteColor,
}

/** json-render-style UI tree (subset; see Farcaster elements catalog). */
export type SnapUi = {
	root: string,
	elements: Record<
		string,
		{
			type: string,
			props: Record<string, unknown>,
			children?: string[],
			on?: Record<
				string,
				{
					action: string,
					params?: Record<string, unknown>,
				}
			>,
		}
	>,
	state?: Record<string, unknown>,
}

export type SnapResponse = {
	version: '1.0',
	theme?: SnapTheme,
	effects?: string[],
	ui: SnapUi,
}

export type SnapJfsPayload = {
	fid: number,
	inputs: Record<string, unknown>,
	button_index: number,
	timestamp: number,
}

type SnapJfsEnvelope = {
	header: string,
	payload: string,
	signature: string,
}

export type FramePage = {
	title?: string,
	frame: FrameMeta,
}

/** Per https://docs.farcaster.xyz/snap/actions (submit, open_url, view_token, …). */
type SnapPressAction = {
	action: string,
	params?: Record<string, unknown>,
}

type SupportedButton = {
	button: FrameButton,
	index: number,
	press: SnapPressAction,
}

export const wantsSnapJson = (request: Request) => (
	(request.headers.get('accept') ?? '')
		.includes(SNAP_MEDIA_TYPE)
)

const LOOPBACK_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|::1)(:\d+)?$/

const firstHeaderValue = (value: string | null) => (
	value
		?.split(',')[0]
		?.trim()
)

export const snapBaseUrlFromRequest = (request: Request) => {
	const fromEnv = process.env.SNAP_PUBLIC_BASE_URL?.trim()
	if (fromEnv) {
		return fromEnv.replace(/\/$/, '')
	}

	const forwardedHost = firstHeaderValue(request.headers.get('x-forwarded-host'))
	const host = (
		forwardedHost
		?? firstHeaderValue(request.headers.get('host'))
	)
	if (!host) {
		return `http://localhost:${process.env.PORT ?? '5173'}`
	}

	const proto = (
		firstHeaderValue(request.headers.get('x-forwarded-proto'))
		?? (LOOPBACK_HOST.test(host) ? 'http' : 'https')
	)
	return `${proto}://${host}`.replace(/\/$/, '')
}

export const snapTargetUrl = (
	request: Request,
	pathname: string,
	searchParams?: Record<string, string | number | boolean | undefined>,
) => {
	const url = new URL(pathname, `${snapBaseUrlFromRequest(request)}/`)
	for (const [key, value] of Object.entries(searchParams ?? {})) {
		if (value !== undefined) {
			url.searchParams.set(key, String(value))
		}
	}
	return url.href
}

const frameImageUrlForCurrentPage = (url: URL | string) => {
	const frameImageUrl = new URL(String(url))
	frameImageUrl.searchParams.set('frameImage', '')
	return frameImageUrl.href
}

const snapPublicBase = () => (
	process.env.SNAP_PUBLIC_BASE_URL?.trim().replace(/\/$/, '')
)

/**
 * When testing through an HTTPS reverse proxy, HTML may still reference the dev origin.
 * Set SNAP_PUBLIC_BASE_URL to the public https origin so snap image + submit targets match the tunnel.
 */
export const snapResolvedUrl = (href: string, base: URL | string) => {
	const resolved = resolveUrl(href, base)
	const pub = snapPublicBase()
	if (!pub) {
		return resolved
	}
	try {
		const u = new URL(resolved)
		const b = new URL(String(base))
		if (u.origin === b.origin) {
			return `${pub}${u.pathname}${u.search}${u.hash}`
		}
		if (u.protocol === 'http:' && LOOPBACK_HOST.test(u.host)) {
			return `${pub}${u.pathname}${u.search}${u.hash}`
		}
	} catch {
		/* keep resolved */
	}
	return resolved
}

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

/** Matches `@farcaster/snap` image `aspect` enum (see `IMAGE_ASPECTS`). */
type SnapImageAspect = '1:1' | '16:9' | '4:3' | '9:16'

const SNAP_IMAGE_ASPECTS = [
	'1:1',
	'16:9',
	'4:3',
	'9:16',
] as const satisfies readonly SnapImageAspect[]

const SNAP_IMAGE_ASPECT_WIDTH_PER_HEIGHT: Record<SnapImageAspect, number> = {
	'1:1': 1,
	'16:9': 16 / 9,
	'4:3': 4 / 3,
	'9:16': 9 / 16,
}

/** Default wide frame ratio when meta omits `fc:frame:image:aspect_ratio` (see `+layout.svelte`). */
const FRAME_IMAGE_ASPECT_RATIO_DEFAULT = '1.91:1' as const

const frameAspectWidthPerHeight = (
	aspectRatio?: FrameMeta['image']['aspectRatio'],
) => {
	const raw = aspectRatio ?? FRAME_IMAGE_ASPECT_RATIO_DEFAULT
	const [w, h] = raw.split(':').map(Number)
	return w / h
}

const frameAspectRatioToSnapAspect = (
	aspectRatio?: FrameMeta['image']['aspectRatio'],
): SnapImageAspect => {
	const target = frameAspectWidthPerHeight(aspectRatio)
	return (
		SNAP_IMAGE_ASPECTS
			.reduce(
				(best, aspect) => (
					Math.abs(SNAP_IMAGE_ASPECT_WIDTH_PER_HEIGHT[aspect] - target)
					< Math.abs(SNAP_IMAGE_ASPECT_WIDTH_PER_HEIGHT[best] - target)
						? aspect
						: best
				),
				SNAP_IMAGE_ASPECTS[0],
			)
	)
}

/**
 * Frame mint targets use `eip155:chain:0x…`; Snap `view_token` expects CAIP-19 `eip155:chain/erc20:0x…`.
 * @see https://docs.farcaster.xyz/snap/actions#view_token
 */
const frameMintTargetToViewToken = (mint: string) => {
	const t = mint.trim()
	if (t.startsWith('eip155:') && t.includes('/erc20:'))
		return t

	const m = t.match(/^eip155:(\d+):(0x[a-fA-F0-9]+)$/)
	return (
		m
			? `eip155:${m[1]}/erc20:${m[2]}`
			: undefined
	)
}

const snapPressFromFrameButton = (
	button: FrameButton,
	baseUrl: URL | string,
): SnapPressAction | undefined => {
	if (!button.targetUrl) {
		return undefined
	}

	const target = snapResolvedUrl(button.targetUrl, baseUrl)

	if (button.action === 'post' || button.action === 'post_redirect') {
		return {
			action: 'submit',
			params: { target },
		}
	}

	if (button.action === 'link' || button.action === undefined) {
		return {
			action: 'open_url',
			params: { target },
		}
	}

	if (button.action === 'mint') {
		const token = frameMintTargetToViewToken(button.targetUrl)
		return (
			token
				? {
					action: 'view_token',
					params: { token },
				}
				: {
					action: 'open_url',
					params: {
						target: 'https://docs.farcaster.xyz/reference/frames/spec',
					},
				}
		)
	}

	if (button.action === 'tx') {
		return {
			action: 'open_url',
			params: { target },
		}
	}

	return undefined
}

const snapButtonIcon = (press: SnapPressAction) => (
	press.action === 'open_url'
		? 'external-link'
	: press.action === 'view_token'
		? 'wallet'
	:
		undefined
)

const snapCaptionForFrame = (
	baseUrl: URL | string,
	supportedCount: number,
) => {
	try {
		const path = new URL(String(baseUrl)).pathname
		const where = path === '/' ? 'SKIFFLE' : path
		const n = supportedCount
		const line = `${where} · ${n} action${n === 1 ? '' : 's'}`
		return line.length > 320 ? `${line.slice(0, 317)}…` : line
	} catch {
		return `${supportedCount} action(s)`
	}
}

const snapEffectsForFrame = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = new URL(
			resolveUrl(
				frame.image.url || String(baseUrl),
				baseUrl,
			),
		)

		return (
			stateUrl.searchParams.get('status') === 'x-win'
			|| stateUrl.searchParams.get('status') === 'win'
			|| stateUrl.searchParams.get('outcome') === 'win'
		)
			? ['confetti']
			: undefined
	} catch {
		return undefined
	}
}

export const framePageToSnap = (
	{ title, frame }: FramePage,
	baseUrl: URL | string,
): SnapResponse => {
	const buttons = frame.buttons?.filter((button) => button !== undefined) ?? []
	const supportedButtons: SupportedButton[] = []

	for (const [index, button] of buttons.entries()) {
		if (!button) {
			continue
		}

		const press = snapPressFromFrameButton(button, baseUrl)
		if (press) {
			supportedButtons.push({
				button,
				index,
				press,
			})
		}
	}

	const unsupportedButtonCount = buttons.length - supportedButtons.length

	const pageChildren = (
		[
			'hero',
			'sep-hero',
			...(title ? ['title-text'] : []),
			'caption',
			...(frame.textInput ? ['input'] : []),
			...(supportedButtons.length ? ['actions'] : []),
			...(unsupportedButtonCount ? ['unsupported'] : []),
		]
	)

	const elements: SnapResponse['ui']['elements'] = {
		page: {
			type: 'stack',
			props: {
				gap: 'md',
			},
			children: pageChildren,
		},
		hero: {
			type: 'image',
			props: {
				url: snapResolvedUrl(
					frameImageUrlForCurrentPage(
						resolveUrl(
							frame.image.url || String(baseUrl),
							baseUrl,
						),
					),
					baseUrl,
				),
				aspect: frameAspectRatioToSnapAspect(frame.image.aspectRatio),
				alt: title ?? 'SKIFFLE preview',
			},
		},
		'sep-hero': {
			type: 'separator',
			props: {},
		},
		caption: {
			type: 'text',
			props: {
				content: snapCaptionForFrame(baseUrl, supportedButtons.length),
				size: 'sm',
				align: 'center',
			},
		},
	}

	if (title) {
		elements['title-text'] = {
			type: 'text',
			props: {
				content: title.length > 320 ? `${title.slice(0, 317)}…` : title,
				weight: 'bold',
				align: 'center',
			},
		}
	}

	if (frame.textInput) {
		elements.input = {
			type: 'input',
			props: {
				name: 'text',
				label: frame.textInput,
				placeholder: 'Optional',
				maxLength: 280,
			},
		}
	}

	if (supportedButtons.length) {
		const useHorizontalActions = supportedButtons.length <= 3
		elements.actions = {
			type: 'stack',
			props: {
				direction: useHorizontalActions ? 'horizontal' : 'vertical',
				gap: 'sm',
				...(useHorizontalActions
					? { justify: 'center' as const }
					: {}),
			},
			children: supportedButtons.map(({ index }) => `button-${index}`),
		}

		for (const { button, index, press } of supportedButtons) {
			const icon = snapButtonIcon(press)
			const primary = supportedButtons.findIndex((s) => s.index === index) === 0
			elements[`button-${index}`] = {
				type: 'button',
				props: {
					label: button.label.slice(0, 30),
					variant: primary ? 'primary' : 'secondary',
					...(icon ? { icon } : {}),
				},
				on: {
					press,
				},
			}
		}
	}

	if (unsupportedButtonCount) {
		elements.unsupported = {
			type: 'text',
			props: {
				content: `${unsupportedButtonCount} frame action${unsupportedButtonCount === 1 ? '' : 's'} not mapped to Snap.`,
				size: 'sm',
				align: 'center',
			},
		}
	}

	return {
		version: '1.0',
		effects: snapEffectsForFrame(frame, baseUrl),
		theme: { accent: 'purple' },
		ui: {
			root: 'page',
			elements,
		},
	}
}

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

export const parseFramePageFromHtml = (
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
			version: properties['fc:frame'] as FrameMeta['version'] | undefined,
			image: {
				url: imageUrl,
				aspectRatio: properties['fc:frame:image:aspect_ratio'] as FrameMeta['image']['aspectRatio'] | undefined,
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
	}
}

export const createSnapResponse = (
	body: SnapResponse,
	requestUrl: URL,
) => {
	const self = resolveUrl(requestUrl.pathname + requestUrl.search, requestUrl)
	const link = (
		`<${self}>; rel="alternate"; type="${SNAP_MEDIA_TYPE}", `
		+ `<${self}>; rel="alternate"; type="text/html"`
	)
	return new Response(
		JSON.stringify(body),
		{
			status: 200,
			headers: {
				'content-type': SNAP_MEDIA_TYPE,
				'vary': 'Accept',
				'link': link,
			},
		},
	)
}

const JFS_PARTS = 3

export const isLikelyJfsCompact = (text: string) => {
	const trimmed = text.trim()
	const parts = trimmed.split('.')
	return (
		parts.length === JFS_PARTS
		&& parts.every((p) => p.length > 0)
	)
}

const parseSnapJfsEnvelope = (
	text: string,
): SnapJfsEnvelope | undefined => {
	const trimmed = text.trim()

	if (isLikelyJfsCompact(trimmed)) {
		const [header, payload, signature] = trimmed.split('.')
		return {
			header,
			payload,
			signature,
		}
	}

	try {
		const value = JSON.parse(trimmed) as Partial<SnapJfsEnvelope>
		if (
			value
			&& typeof value === 'object'
			&& typeof value.header === 'string'
			&& typeof value.payload === 'string'
			&& typeof value.signature === 'string'
		) {
			return {
				header: value.header,
				payload: value.payload,
				signature: value.signature,
			}
		}
	} catch {
		/* not JSON */
	}

	return undefined
}

export const hasSnapJfsEnvelope = (text: string) => (
	parseSnapJfsEnvelope(text) !== undefined
)

export const parseFrameSignatureJson = (
	text: string,
): FrameSignaturePacket | undefined => {
	try {
		const v = JSON.parse(text) as Partial<FrameSignaturePacket>
		if (v && typeof v === 'object' && v.untrustedData !== undefined) {
			return v as FrameSignaturePacket
		}
	} catch {
		/* not JSON */
	}
	return undefined
}

export const readSnapJfsPayload = async (jfsBody: string) => {
	const envelope = parseSnapJfsEnvelope(jfsBody)
	if (!envelope) {
		throw new Error('snap: invalid JFS body')
	}

	const skip = (
		process.env.SKIP_JFS_VERIFICATION === '1'
		|| process.env.SKIP_JFS_VERIFICATION === 'true'
		|| (
			process.env.SKIP_JFS_VERIFICATION === undefined
			&& process.env.NODE_ENV !== 'production'
		)
	)
	const compactJfs = `${envelope.header}.${envelope.payload}.${envelope.signature}`
	const payload = (
		skip
			? JSON.parse(
				Buffer
					.from(envelope.payload, 'base64url')
					.toString('utf8'),
			) as SnapJfsPayload
			: decode<SnapJfsPayload>(compactJfs).payload
	)
	if (!skip) {
		await verify({ data: compactJfs })
		const now = Math.floor(Date.now() / 1000)
		const skew = 300
		if (Math.abs(now - payload.timestamp) > skew) {
			throw new Error('snap: timestamp outside allowed skew')
		}
	}
	return payload
}
