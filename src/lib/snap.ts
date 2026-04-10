// Farcaster Snaps
// https://docs.farcaster.xyz/snap


// Types/constants
import { AppSnapButtonRoles, AppSnapNodeTypes } from '$/lib/app-snap-tokens'
import type { AppSnapButton, AppSnapButtonNode, AppSnapPage } from '$/lib/snap-components'
import type { FrameButton, FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

import { resolveUrl } from '$/lib/resolveUrl'
import { coinFlipSnapExtraElements } from '$/routes/(examples)/demos/coin-flip/snap'
import { hangmanSnapExtraElements } from '$/routes/(examples)/demos/hangman/snap'
import { ticTacToeSnapExtraElements } from '$/routes/(examples)/demos/tic-tac-toe/snap'
import { wordleSnapExtraElements } from '$/routes/(examples)/demos/wordle/snap'
import {
	SnapActions,
	SnapAlignments,
	SnapButtonVariants,
	SnapDirections,
	SnapElementTypes,
	SnapEvents,
	SnapGaps,
	SnapIcons,
	SnapImageAspects,
	SnapJustifyValues,
	SnapPaletteColors,
	SnapTextSizes,
	SnapTextWeights,
	SnapUiRoots,
	SnapVersion,
	type SnapAction,
	type SnapElementType,
	type SnapEffect,
	type SnapEvent,
	type SnapImageAspect,
	type SnapPaletteColor,
	type SnapUiRoot,
} from '$/lib/snap-spec'

export type SnapTheme = {
	accent?: SnapPaletteColor,
}

/** json-render-style UI tree (subset; see Farcaster elements catalog). */
export type SnapUi = {
	root: SnapUiRoot,
	elements: Record<
		string,
		{
			type: SnapElementType,
			props: Record<string, unknown>,
			children?: string[],
			on?: Record<
				SnapEvent,
				{
					action: SnapAction,
					params?: Record<string, unknown>,
				}
			>,
		}
	>,
	state?: Record<string, unknown>,
}

export type SnapResponse = {
	version: typeof SnapVersion,
	theme?: SnapTheme,
	effects?: SnapEffect[],
	ui: SnapUi,
}

export type FramePage = {
	title?: string,
	frame: FrameMeta,
	snap?: AppSnapPage,
}

/** Per https://docs.farcaster.xyz/snap/actions (submit, open_url, view_token, …). */
type SnapPressAction = {
	action: SnapAction,
	params?: Record<string, unknown>,
}

type SnapExtraElementProvider = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => SnapExtraElements | undefined

const LOOPBACK_HOST = /^(localhost|127\.0\.0\.1|\[::1\]|::1)(:\d+)?$/
const SNAP_FOOTER_CONTEXT_PARAM = 'snapFooter'

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

const SNAP_IMAGE_ASPECTS = [
	SnapImageAspects.Square,
	SnapImageAspects.Wide,
	SnapImageAspects.Standard,
	SnapImageAspects.Portrait,
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

const snapPressFromButton = (
	{ press }: AppSnapButton,
	baseUrl: URL | string,
): SnapPressAction | undefined => {
	if (press.action === SnapActions.ComposeCast) {
		return {
			action: SnapActions.ComposeCast,
			params: {
				text: press.text,
				...(press.embeds?.length ? { embeds: press.embeds } : {}),
			},
		}
	}

	if (press.action === SnapActions.ViewToken) {
		return {
			action: SnapActions.ViewToken,
			params: { token: press.token },
		}
	}

	if (press.action === SnapActions.Submit || press.action === SnapActions.OpenUrl || press.action === SnapActions.OpenMiniApp) {
		return {
			action: press.action,
			params: {
				target: snapResolvedUrl(press.targetUrl, baseUrl),
			},
		}
	}

	if (!press.targetUrl) {
		return undefined
	}

	if (press.action === 'post' || press.action === 'post_redirect') {
		return {
			action: SnapActions.Submit,
			params: {
				target: snapResolvedUrl(press.targetUrl, baseUrl),
			},
		}
	}

	if (press.action === 'link' || press.action === undefined) {
		return {
			action: SnapActions.OpenUrl,
			params: {
				target: snapResolvedUrl(press.targetUrl, baseUrl),
			},
		}
	}

	if (press.action === 'mint') {
		const token = frameMintTargetToViewToken(press.targetUrl)

		return (
			token
				? {
					action: SnapActions.ViewToken,
					params: { token },
				}
				: {
					action: SnapActions.OpenUrl,
					params: {
						target: 'https://docs.farcaster.xyz/reference/frames/spec',
					},
				}
		)
	}

	if (press.action === 'tx') {
		return {
			action: SnapActions.OpenUrl,
			params: {
				target: snapResolvedUrl(press.targetUrl, baseUrl),
			},
		}
	}

	return undefined
}

const snapButtonIcon = (
	button: AppSnapButton,
	press: SnapPressAction,
) => (
	button.icon
		?? (
			button.role === AppSnapButtonRoles.Share ?
				SnapIcons.Share
			: button.role === AppSnapButtonRoles.External ?
				SnapIcons.ExternalLink
			: press.action === SnapActions.ViewToken ?
				SnapIcons.Wallet
			:
				undefined
		)
)

const stripQueryParam = (
	url: string,
	param: string,
) => {
	const hashIndex = url.indexOf('#')
	const hash = hashIndex === -1 ? '' : url.slice(hashIndex)
	const beforeHash = hashIndex === -1 ? url : url.slice(0, hashIndex)
	const queryIndex = beforeHash.indexOf('?')

	if (queryIndex === -1) {
		return url
	}

	const query = beforeHash.slice(queryIndex + 1)
	const nextQuery = query
		.split('&')
		.filter((part) => (
			part
			&& part !== param
			&& !part.startsWith(`${param}=`)
		))
		.join('&')

	return `${beforeHash.slice(0, queryIndex)}${nextQuery ? `?${nextQuery}` : ''}${hash}`
}

const snapCurrentPageUrl = (baseUrl: URL | string) => (
	stripQueryParam(
		snapResolvedUrl(String(baseUrl), baseUrl),
		SNAP_FOOTER_CONTEXT_PARAM,
	)
)

const snapFooterContextUrl = (
	baseUrl: URL | string,
	context?: string,
) => {
	const currentUrl = snapCurrentPageUrl(baseUrl)
	return (
		context
			? `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}${SNAP_FOOTER_CONTEXT_PARAM}=${encodeURIComponent(context)}`
			: currentUrl
	)
}

const snapExtraElementProviders = [
	coinFlipSnapExtraElements,
	hangmanSnapExtraElements,
	ticTacToeSnapExtraElements,
	wordleSnapExtraElements,
] satisfies SnapExtraElementProvider[]

const SNAP_ACTION_MAX_CHILDREN = 6
const SNAP_ACTION_MAX_DEPTH = 4
const SNAP_TOTAL_ELEMENTS_MAX = 64

const assertSnapActionConstraint = (
	constraint: boolean,
	message: string,
) => {
	if (!constraint) {
		throw new Error(`snap: ${message}`)
	}
}

const snapActionElements = (
	nodes: AppSnapButtonNode[],
	baseUrl: URL | string,
) => {
	assertSnapActionConstraint(
		nodes.length <= SNAP_ACTION_MAX_CHILDREN,
		`action root supports at most ${SNAP_ACTION_MAX_CHILDREN} children`,
	)

	let idCounter = 0

	const elements: SnapResponse['ui']['elements'] = {}

	const nextId = (prefix: string) => `${prefix}-${idCounter++}`

	const buildNode = (
		node: AppSnapButtonNode,
		depth: number,
	): string => {
		assertSnapActionConstraint(
			depth <= SNAP_ACTION_MAX_DEPTH,
			`button groups may nest at most ${SNAP_ACTION_MAX_DEPTH} levels deep`,
		)

		if (node.type === AppSnapNodeTypes.Button) {
			const press = snapPressFromButton(node, baseUrl)

			if (!press) {
				throw new Error(`snap: unsupported button press mapping for "${node.label}"`)
			}

			const id = nextId('action-button')
			const icon = snapButtonIcon(node, press)

			elements[id] = {
				type: SnapElementTypes.Button,
				props: {
					label: node.label.slice(0, 30),
					...(node.variant ? { variant: node.variant } : {}),
					...(icon ? { icon } : {}),
				},
				on: {
					[SnapEvents.Press]: press,
				},
			}

			return id
		}

		assertSnapActionConstraint(
			node.children.length <= SNAP_ACTION_MAX_CHILDREN,
			`button group supports at most ${SNAP_ACTION_MAX_CHILDREN} children`,
		)

		const id = nextId('action-group')
		const children = node.children.map((child) => buildNode(child, depth + 1))

		elements[id] = {
			type: SnapElementTypes.Stack,
			props: {
				...(node.direction ? { direction: node.direction } : {}),
				...(node.gap ? { gap: node.gap } : {}),
				...(node.justify ? { justify: node.justify } : {}),
			},
			children,
		}

		return id
	}

	elements.actions = {
		type: SnapElementTypes.Stack,
		props: {
			gap: SnapGaps.Sm,
		},
		children: nodes.map((node) => buildNode(node, 1)),
	}

	return elements
}

export const framePageToSnap = (
	{ title, frame, snap }: FramePage,
	baseUrl: URL | string,
): SnapResponse => {
	const currentPageUrl = snapCurrentPageUrl(baseUrl)
	const extraElements = snapExtraElementProviders
		.map((provider) => provider(frame, baseUrl))
		.find((value) => value !== undefined)
	const actionElements = snap?.buttons?.length
		? snapActionElements(snap.buttons, baseUrl)
		: undefined
	const isGoMenuOpen = new URL(snapResolvedUrl(String(baseUrl), baseUrl))
		.searchParams
		.get(SNAP_FOOTER_CONTEXT_PARAM) === 'go'
	const footerChildren = (
		isGoMenuOpen
			? ['page-go-input', 'page-go-actions']
			: ['page-url', 'page-actions', 'page-follow-separator', 'page-follow']
	)

	const pageChildren = (
		[
			...(title ? ['title-text'] : []),
			'hero',
			...(extraElements?.children ?? []),
			...(
				frame.textInput && !extraElements?.hideInput
					? ['input']
					: []
			),
			...(actionElements ? ['actions'] : []),
			'sep-page-link',
			'page-footer',
		]
	)

	const elements: SnapResponse['ui']['elements'] = {
		page: {
			type: SnapElementTypes.Stack,
			props: {
				gap: SnapGaps.Md,
			},
			children: pageChildren,
		},
		hero: {
			type: SnapElementTypes.Image,
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
		'sep-page-link': {
			type: SnapElementTypes.Separator,
			props: {},
		},
		'page-footer': {
			type: SnapElementTypes.Stack,
			props: {
				gap: SnapGaps.Sm,
			},
			children: footerChildren,
		},
		'page-url': {
			type: SnapElementTypes.Text,
			props: {
				content: currentPageUrl
					.replace(/^https?:\/\//, '')
					.replace(/%2f/gi, '/'),
				size: SnapTextSizes.Sm,
				align: SnapAlignments.Center,
			},
		},
		'page-go-input': {
			type: SnapElementTypes.Input,
			props: {
				name: 'gotoPath',
				label: 'Go to Page',
				placeholder: '/about or /demos/wordle?/open',
				maxLength: 280,
			},
		},
		'page-actions': {
			type: SnapElementTypes.Stack,
			props: {
				direction: SnapDirections.Horizontal,
				gap: SnapGaps.Sm,
				justify: SnapJustifyValues.Center,
			},
			children: ['page-share', 'page-link', 'page-go'],
		},
		'page-share': {
			type: SnapElementTypes.Button,
			props: {
				label: 'Share',
				variant: SnapButtonVariants.Secondary,
				icon: SnapIcons.Share,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.ComposeCast,
					params: {
						text: (
							snap?.shareText
							?? (
								title
									? `Checking out ${title} on SKIFFLE.`
									: 'Checking out SKIFFLE on Farcaster.'
							)
						).slice(0, 320),
						embeds: [currentPageUrl],
					},
				},
			},
		},
		'page-link': {
			type: SnapElementTypes.Button,
			props: {
				label: 'Visit',
				variant: SnapButtonVariants.Secondary,
				icon: SnapIcons.ExternalLink,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.OpenUrl,
					params: {
						target: currentPageUrl,
					},
				},
			},
		},
		'page-go': {
			type: SnapElementTypes.Button,
			props: {
				label: 'Go to...',
				variant: SnapButtonVariants.Secondary,
				icon: SnapIcons.ArrowRight,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.Submit,
					params: {
						target: snapFooterContextUrl(baseUrl, 'go'),
					},
				},
			},
		},
		'page-go-actions': {
			type: SnapElementTypes.Stack,
			props: {
				direction: SnapDirections.Horizontal,
				gap: SnapGaps.Sm,
				justify: SnapJustifyValues.Center,
			},
			children: ['page-go-open', 'page-go-close'],
		},
		'page-follow-separator': {
			type: SnapElementTypes.Separator,
			props: {},
		},
		'page-go-open': {
			type: SnapElementTypes.Button,
			props: {
				label: 'Go',
				variant: SnapButtonVariants.Primary,
				icon: SnapIcons.Check,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.Submit,
					params: {
						target: (() => {
							const target = new URL(snapResolvedUrl('/go', baseUrl))
							target.search = `?/open&from=${encodeURIComponent(currentPageUrl)}`
							return target.href
						})(),
					},
				},
			},
		},
		'page-go-close': {
			type: SnapElementTypes.Button,
			props: {
				label: 'Cancel',
				variant: SnapButtonVariants.Secondary,
				icon: SnapIcons.X,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.Submit,
					params: {
						target: snapFooterContextUrl(baseUrl),
					},
				},
			},
		},
		'page-follow': {
			type: SnapElementTypes.Button,
			props: {
				label: 'Follow @darrylyeo',
				variant: SnapButtonVariants.Secondary,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.OpenUrl,
					params: {
						target: 'https://farcaster.xyz/darrylyeo',
					},
				},
			},
		},
		...(extraElements?.elements ?? {}),
		...(actionElements ?? {}),
	}

	if (title) {
		elements['title-text'] = {
			type: SnapElementTypes.Text,
			props: {
				content: title.length > 320 ? `${title.slice(0, 317)}…` : title,
				weight: SnapTextWeights.Bold,
				align: SnapAlignments.Center,
			},
		}
	}

	if (frame.textInput) {
		elements.input = {
			type: SnapElementTypes.Input,
			props: {
				name: 'inputText',
				label: frame.textInput,
				placeholder: frame.textInput,
				maxLength: 280,
			},
		}
	}

	assertSnapActionConstraint(
		Object.keys(actionElements ?? {}).length <= SNAP_TOTAL_ELEMENTS_MAX,
		`button tree supports at most ${SNAP_TOTAL_ELEMENTS_MAX} elements`,
	)

	return {
		version: SnapVersion,
		effects: snap?.effects,
		theme: {
			accent: snap?.theme?.accent ?? SnapPaletteColors.Purple,
		},
		ui: {
			root: SnapUiRoots.Page,
			elements,
		},
	}
}

