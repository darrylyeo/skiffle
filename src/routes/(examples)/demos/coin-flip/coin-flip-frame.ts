// Types
import type { FrameMeta } from '$/lib/frame'
import type { AppSnapPage } from '$/lib/snap-components'

// Functions
import { frameButtons } from '$/lib/frame'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

export type CoinFlipResult = 'heads' | 'tails'

export type CoinFlipState = {
	seed: number
	flips: number
	heads: number
	tails: number
	lastResult?: CoinFlipResult
}

const normalizeSeed = (value: number) => (
	Math.max(1, Math.abs(Number.isFinite(value) ? Math.floor(value) : 1)) % 2_147_483_647
)

const clampCount = (value: number) => (
	Math.max(0, Math.min(9_999, Number.isFinite(value) ? Math.floor(value) : 0))
)

const nextRandom = (value: number) => (
	(value * 48_271) % 2_147_483_647
)

const flipResult = (
	seed: number,
	flips: number,
): CoinFlipResult => (
	nextRandom(seed + flips * 97) % 2 === 0
		? 'heads'
		: 'tails'
)

const resultLabel = (result: CoinFlipResult | undefined) => (
	result === 'heads'
		? 'Heads'
	: result === 'tails'
		? 'Tails'
	:
		'Flip the coin'
)

const leadLabel = ({
	heads,
	tails,
}: Pick<CoinFlipState, 'heads' | 'tails'>) => (
	heads === tails
		? 'Even split so far.'
	: heads > tails
		? `Heads leads by ${heads - tails}.`
	:
		`Tails leads by ${tails - heads}.`
)

export const coinFlipMessage = (state: CoinFlipState) => (
	state.lastResult
		? `${resultLabel(state.lastResult)}. ${leadLabel(state)}`
	: 'Call it and tap flip.'
)

export const parseCoinFlipState = (url: URL): CoinFlipState => ({
	seed: normalizeSeed(Number(url.searchParams.get('seed') ?? 1)),
	flips: clampCount(Number(url.searchParams.get('flips') ?? 0)),
	heads: clampCount(Number(url.searchParams.get('heads') ?? 0)),
	tails: clampCount(Number(url.searchParams.get('tails') ?? 0)),
	lastResult: (() => {
		const result = url.searchParams.get('lastResult')

		return result === 'heads' || result === 'tails'
			? result
			: undefined
	})(),
})

export const coinFlipFace = (state: CoinFlipState) => (
	state.lastResult === 'heads'
		? 'H'
	: state.lastResult === 'tails'
		? 'T'
	:
		'?'
)

export const nextCoinFlipState = (state: CoinFlipState): CoinFlipState => {
	const lastResult = flipResult(state.seed, state.flips + 1)

	return {
		seed: normalizeSeed(nextRandom(state.seed)),
		flips: clampCount(state.flips + 1),
		heads: clampCount(state.heads + (lastResult === 'heads' ? 1 : 0)),
		tails: clampCount(state.tails + (lastResult === 'tails' ? 1 : 0)),
		lastResult,
	}
}

export const coinFlipStateFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return parseCoinFlipState(new URL(href))
	} catch {
		return undefined
	}
}

export const freshCoinFlipState = (seed: number): CoinFlipState => ({
	seed: normalizeSeed(seed),
	flips: 0,
	heads: 0,
	tails: 0,
})

const coinFlipTargetParams = (state: CoinFlipState) => (
	new URLSearchParams({
		seed: String(state.seed),
		flips: String(state.flips),
		heads: String(state.heads),
		tails: String(state.tails),
		...(state.lastResult ? { lastResult: state.lastResult } : {}),
	})
)

export const buildCoinFlipFrame = (state: CoinFlipState): FrameMeta => ({
	image: {
		url: `/demos/coin-flip?${coinFlipTargetParams(state)}`,
		aspectRatio: '1:1',
	},
	buttons: frameButtons(
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: '/?/demos',
		},
		{
			label: 'Flip',
			action: 'post',
			targetUrl: `/demos/coin-flip?/flip&${coinFlipTargetParams(state)}`,
		},
		state.flips > 0 && {
			label: 'Reset',
			action: 'post',
			targetUrl: '/demos/coin-flip?/open',
		},
	),
})

export const buildCoinFlipSnap = (state: CoinFlipState): AppSnapPage => ({
	shareText: `Trying the Coin Flip demo in SKIFFLE. ${coinFlipMessage(state)}`,
	theme: {
		accent: (
			state.lastResult === 'heads'
				? SnapPaletteColors.Amber
			: state.lastResult === 'tails'
				? SnapPaletteColors.Blue
			:
				SnapPaletteColors.Purple
		),
	},
	buttons: [
		snapButtonGroup({
			direction: SnapDirections.Horizontal,
			gap: SnapGaps.Sm,
			justify: SnapJustifyValues.Center,
			children: [
				snapTargetButton({
					label: '‹ Demos',
					role: AppSnapButtonRoles.Back,
					action: 'post',
					targetUrl: '/?/demos',
				}),
				snapTargetButton({
					label: 'Flip',
					role: AppSnapButtonRoles.Cta,
					variant: SnapButtonVariants.Primary,
					action: 'post',
					targetUrl: `/demos/coin-flip?/flip&${coinFlipTargetParams(state)}`,
				}),
			],
		}),
		...(state.flips > 0
			? [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: [
						snapTargetButton({
							label: 'Reset',
							action: 'post',
							targetUrl: '/demos/coin-flip?/open',
						}),
					],
				}),
			]
			: []),
	],
})
