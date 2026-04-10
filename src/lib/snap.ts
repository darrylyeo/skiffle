// Farcaster Snaps
// https://docs.farcaster.xyz/snap


// Types/constants
import type { FrameButton, FrameMeta, FrameSignaturePacket } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

import { clampCount } from '$/routes/(examples)/farcaster/demos/counter/counter-frame'
import { hangmanMessage, parseHangmanState } from '$/routes/(examples)/farcaster/demos/hangman/hangman-frame'
import { parseRockPaperScissorsState, rockPaperScissorsSummary } from '$/routes/(examples)/farcaster/demos/rock-paper-scissors/rock-paper-scissors-frame'
import { parseTicTacToeState, ticTacToeMessage } from '$/routes/(examples)/farcaster/demos/tic-tac-toe/tic-tac-toe-frame'
import { tipsPagination } from '$/routes/(examples)/farcaster/demos/tips/tips-frame'
import { parseWordleState, wordleMessage } from '$/routes/(examples)/farcaster/demos/wordle/wordle-frame'
import { resolveUrl } from '$/lib/resolveUrl'
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'
import { hangmanSnapExtraElements } from '$/routes/(examples)/farcaster/demos/hangman/snap'
import { wordleSnapExtraElements } from '$/routes/(examples)/farcaster/demos/wordle/snap'

export const SNAP_MEDIA_TYPE = 'application/vnd.farcaster.snap+json' as const
export const SNAP_VERSION = '2.0' as const

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
	version: typeof SNAP_VERSION,
	theme?: SnapTheme,
	effects?: string[],
	ui: SnapUi,
}

export type SnapJfsPayload = {
	fid: number,
	inputs: Record<string, unknown>,
	timestamp: number,
	nonce: string,
	audience: string,
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

type SnapExtraElementProvider = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => SnapExtraElements | undefined

type SnapShareTextResolver = {
	matches: (url: URL) => boolean
	text: (url: URL, title?: string) => string
}

export const wantsSnapJson = (request: Request) => (
	(request.headers.get('accept') ?? '')
		.includes(SNAP_MEDIA_TYPE)
)

const LOOPBACK_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|::1)(:\d+)?$/

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

const snapCurrentPageUrl = (baseUrl: URL | string) => (
	snapResolvedUrl(String(baseUrl), baseUrl)
)

const snapShareTextResolvers = [
	{
		matches: ({ pathname }) => pathname === '/',
		text: () => 'Exploring SKIFFLE, a SvelteKit demo for Farcaster Frames and Snaps.',
	},
	{
		matches: ({ pathname }) => pathname === '/about',
		text: () => 'Reading how SKIFFLE serves HTML, frame previews, and Snap JSON from the same routes.',
	},
	{
		matches: ({ pathname }) => pathname === '/farcaster/channels',
		text: () => 'Browsing popular Farcaster channels in SKIFFLE.',
	},
	{
		matches: ({ pathname }) => pathname === '/farcaster/demos/counter',
		text: (url) => `Trying the SKIFFLE counter demo. Count: ${clampCount(Number(url.searchParams.get('count') ?? 0))}.`,
	},
	{
		matches: ({ pathname }) => pathname === '/farcaster/demos/tips',
		text: (url) => {
			const { currentPage, totalPages, message } = tipsPagination(url)
			return `Reading SKIFFLE tip ${currentPage + 1} of ${totalPages}. ${message}`
		},
	},
	{
		matches: ({ pathname }) => pathname === '/farcaster/demos/hangman',
		text: (url) => `Playing Hangman in SKIFFLE. ${hangmanMessage(parseHangmanState(url))}`,
	},
	{
		matches: ({ pathname }) => pathname === '/farcaster/demos/wordle',
		text: (url) => `Playing Wordle in SKIFFLE. ${wordleMessage(parseWordleState(url))}`,
	},
	{
		matches: ({ pathname }) => pathname === '/farcaster/demos/rock-paper-scissors',
		text: (url) => `Playing Rock Paper Scissors in SKIFFLE. ${rockPaperScissorsSummary(parseRockPaperScissorsState(url))}`,
	},
	{
		matches: ({ pathname }) => pathname === '/farcaster/demos/tic-tac-toe',
		text: (url) => `Playing Tic-tac-toe in SKIFFLE. ${ticTacToeMessage(parseTicTacToeState(url).status)}`,
	},
	{
		matches: ({ pathname }) => /^\/farcaster\/user\/[^/]+\/casts$/.test(pathname),
		text: (_url, title) => (
			title
				? `Browsing recent Farcaster casts in SKIFFLE: ${title}.`
				: 'Browsing recent Farcaster casts in SKIFFLE.'
		),
	},
	{
		matches: ({ pathname }) => /^\/farcaster\/user\/[^/]+$/.test(pathname),
		text: (_url, title) => (
			title
				? `Checking out a Farcaster profile in SKIFFLE: ${title}.`
				: 'Checking out a Farcaster profile in SKIFFLE.'
		),
	},
] satisfies SnapShareTextResolver[]

const snapShareTextForFrame = (
	{ title }: FramePage,
	baseUrl: URL | string,
) => {
	try {
		const url = new URL(String(baseUrl))
		const text = (
			snapShareTextResolvers
				.find(({ matches }) => matches(url))
				?.text(url, title)
			?? (
				title
					? `Exploring ${title} on SKIFFLE.`
					: 'Exploring SKIFFLE on Farcaster.'
			)
		)
		return text.length > 320 ? `${text.slice(0, 317)}…` : text
	} catch {
		return 'Exploring SKIFFLE on Farcaster.'
	}
}

const snapEffectsForFrame = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)

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

const snapThemeAccentResolvers = {
	'/farcaster/channels': () => (
		'blue'
	),
	'/farcaster/demos/wordle': (stateUrl: URL) => (
		stateUrl.searchParams.get('status') === 'win' ?
			'green'
		: stateUrl.searchParams.get('status') === 'loss' || stateUrl.searchParams.get('status') === 'invalid' ?
			'red'
		:
			'amber'
	),
	'/farcaster/demos/hangman': (stateUrl: URL) => (
		stateUrl.searchParams.get('status') === 'win' ?
			'green'
		: stateUrl.searchParams.get('status') === 'loss' || stateUrl.searchParams.get('status') === 'invalid' || stateUrl.searchParams.get('status') === 'repeat' ?
			'red'
		:
			'amber'
	),
	'/farcaster/demos/tic-tac-toe': (stateUrl: URL) => (
		stateUrl.searchParams.get('status') === 'x-win' ?
			'green'
		: stateUrl.searchParams.get('status') === 'o-win' || stateUrl.searchParams.get('status') === 'invalid' ?
			'red'
		:
			'purple'
	),
	'/farcaster/demos/rock-paper-scissors': (stateUrl: URL) => (
		stateUrl.searchParams.get('outcome') === 'win' ?
			'green'
		: stateUrl.searchParams.get('outcome') === 'loss' ?
			'red'
		: stateUrl.searchParams.get('outcome') === 'draw' ?
			'blue'
		:
			'purple'
	),
	'/farcaster/demos/tips': () => (
		'amber'
	),
	'/farcaster/demos/counter': () => (
		'teal'
	),
} satisfies Record<string, (stateUrl: URL) => SnapPaletteColor>

const snapExtraElementProviders = [
	hangmanSnapExtraElements,
	wordleSnapExtraElements,
] satisfies SnapExtraElementProvider[]

const snapExtraElementsForFrame = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => (
	snapExtraElementProviders
		.map((provider) => provider(frame, baseUrl))
		.find((value) => value !== undefined)
)

const snapThemeAccentForFrame = (
	frame: FrameMeta,
	baseUrl: URL | string,
): SnapPaletteColor => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)
		const resolveAccent = snapThemeAccentResolvers[stateUrl.pathname]
		if (resolveAccent) {
			return resolveAccent(stateUrl)
		}
	} catch {
		/* default below */
	}

	return 'purple'
}

const snapButtonPriority = ({
	button,
	press,
}: SupportedButton) => {
	const label = button.label.trim().toLowerCase()

	return (
		label.includes('guess') || label.includes('play') || label.includes('submit') ?
			4
		: label.includes('more') || label.includes('next') || label.includes('continue') ?
			3
		: press.action === 'submit' && !label.includes('back') && !label.includes('reset') ?
			2
		: press.action === 'open_mini_app' || press.action === 'view_token' ?
			1
		:
			0
	)
}

const snapButtonVariant = (
	supported: SupportedButton,
	supportedButtons: SupportedButton[],
) => (
	snapButtonPriority(supported) > 0
	&& supportedButtons.every((candidate) => (
			candidate.index === supported.index
			|| snapButtonPriority(supported) >= snapButtonPriority(candidate)
		)) ?
		'primary'
	:
		'secondary'
)

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
	const extraElements = snapExtraElementsForFrame(frame, baseUrl)

	const pageChildren = (
		[
			...(title ? ['title-text'] : []),
			'hero',
			'sep-hero',
			...(extraElements?.children ?? []),
			...(frame.textInput ? ['input'] : []),
			...(supportedButtons.length ? ['actions'] : []),
			...(unsupportedButtonCount ? ['unsupported'] : []),
			'sep-page-link',
			'page-actions',
			'page-path',
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
		'sep-page-link': {
			type: 'separator',
			props: {},
		},
		'page-path': {
			type: 'text',
			props: {
				content: snapCurrentPageUrl(baseUrl),
				size: 'sm',
				align: 'center',
			},
		},
		'page-actions': {
			type: 'stack',
			props: {
				direction: 'horizontal',
				gap: 'sm',
				justify: 'center',
			},
			children: ['page-share', 'page-link'],
		},
		'page-share': {
			type: 'button',
			props: {
				label: 'Share',
				variant: 'secondary',
				icon: 'share',
			},
			on: {
				press: {
					action: 'compose_cast',
					params: {
						text: snapShareTextForFrame({ title, frame }, baseUrl),
						embeds: [snapCurrentPageUrl(baseUrl)],
					},
				},
			},
		},
		'page-link': {
			type: 'button',
			props: {
				label: 'View on web',
				variant: 'secondary',
				icon: 'external-link',
			},
			on: {
				press: {
					action: 'open_url',
					params: {
						target: snapCurrentPageUrl(baseUrl),
					},
				},
			},
		},
		...(extraElements?.elements ?? {}),
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
				name: 'inputText',
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
			elements[`button-${index}`] = {
				type: 'button',
				props: {
					label: button.label.slice(0, 30),
					variant: snapButtonVariant(
						{ button, index, press },
						supportedButtons,
					),
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
		version: SNAP_VERSION,
		effects: snapEffectsForFrame(frame, baseUrl),
		theme: { accent: snapThemeAccentForFrame(frame, baseUrl) },
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

export const readSnapJfsPayload = async (
	jfsBody: string,
	_requestUrl: URL | string,
) => {
	const envelope = parseSnapJfsEnvelope(jfsBody)
	if (!envelope) {
		throw new Error('snap: invalid JFS body')
	}

	const payload = JSON.parse(
		Buffer
			.from(envelope.payload, 'base64url')
			.toString('utf8'),
	)
	if (!payload || typeof payload !== 'object') {
		throw new Error('snap: invalid JFS payload')
	}

	return payload
}
