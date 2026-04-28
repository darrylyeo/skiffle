// Types
import type { FrameMeta } from '$/lib/frame'
import { demosBackUrl } from '$/routes/(examples)/demos'
import type { AppSnapPage } from '$/lib/snap-components'

// Functions
import { frameButtons } from '$/lib/frame'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

export type CoinFlipResult = 'heads' | 'tails' | 'edge'

export type CoinFlipState = {
	seed: number
	flips: number
	heads: number
	tails: number
	edge: number
	history: string
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

/** Deterministic 32-bit mix of URL `seed` and 1-based flip index (avoids mod-40 bias from raw LCG). */
const flipEntropy32 = (seed: number, flipIndex: number) => {
	let a = (seed ^ Math.imul(flipIndex, 0x9e3779b9)) >>> 0
	a = Math.imul(a ^ (a >>> 16), 0x85ebca6b) >>> 0
	a = Math.imul(a ^ (a >>> 13), 0xc2b2ae35) >>> 0

	return (a ^ (a >>> 16)) >>> 0
}

const rollMod40 = (seed: number, flipIndex: number) => (
	Math.floor((flipEntropy32(seed, flipIndex) / 4_294_967_296) * 40)
)

const HISTORY_LIMIT = 16

const normalizeHistory = (value: string | null | undefined) => (
	(value ?? '')
		.toLowerCase()
		.replaceAll(/[^hte]/g, '')
		.slice(-HISTORY_LIMIT)
)

const flipResult = (
	seed: number,
	flipIndex: number,
): CoinFlipResult => {
	const roll = rollMod40(seed, flipIndex)

	return (
		roll < 2 ?
			'edge'
		: roll % 2 === 0 ?
			'heads'
		:
			'tails'
	)
}

const resultLabel = (result: CoinFlipResult | undefined) => (
	result === 'heads'
		? 'Heads'
	: result === 'tails'
		? 'Tails'
	: result === 'edge'
		? 'Edge'
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
	state.lastResult === 'edge' ?
		(
			state.edge === 1
				? 'It landed on its edge.'
				: `Edge again. ${state.edge} total edge landings.`
		)
	: state.lastResult ?
		`${resultLabel(state.lastResult)}. ${leadLabel(state)}`
	:
		'Flip the coin.'
)

export const parseCoinFlipState = (url: URL): CoinFlipState => ({
	seed: normalizeSeed(Number(url.searchParams.get('seed') ?? 1)),
	flips: clampCount(Number(url.searchParams.get('flips') ?? 0)),
	heads: clampCount(Number(url.searchParams.get('heads') ?? 0)),
	tails: clampCount(Number(url.searchParams.get('tails') ?? 0)),
	edge: clampCount(Number(url.searchParams.get('edge') ?? 0)),
	history: normalizeHistory(url.searchParams.get('history')),
	lastResult: (() => {
		const result = url.searchParams.get('lastResult')

		return result === 'heads' || result === 'tails' || result === 'edge'
			? result
			: undefined
	})(),
})

export const coinFlipFace = (state: CoinFlipState) => (
	state.lastResult === 'heads'
		? 'H'
	: state.lastResult === 'tails'
		? 'T'
	: state.lastResult === 'edge'
		? 'E'
	:
		'?'
)

const historyCode = (result: CoinFlipResult) => (
	result === 'heads'
		? 'h'
	: result === 'tails'
		? 't'
	:
		'e'
)

export const coinFlipHistory = (state: CoinFlipState) => (
	[...state.history]
		.map((value) => (
			value === 'h'
				? 'heads'
			: value === 't'
				? 'tails'
			:
				'edge'
		))
)

export const coinFlipHistoryBadges = (state: CoinFlipState) => (
	coinFlipHistory(state)
		.map((result, index) => ({
			id: `${state.flips}:${index}:${result}`,
			result,
			label: result === 'heads' ? 'Heads' : result === 'tails' ? 'Tails' : 'Edge',
			short: result === 'heads' ? 'H' : result === 'tails' ? 'T' : 'E',
		}))
)

export const coinFlipShareText = (state: CoinFlipState) => (
	state.lastResult === 'edge'
		? `Landed an edge after ${state.flips} flips on the SKIFFLE demo snapsite 🪙`
	: state.edge > 0
		? `Coin flip update on the SKIFFLE demo snapsite: heads ${state.heads}, tails ${state.tails}, edge ${state.edge} after ${state.flips} flips 🪙`
	: state.flips === 0
		? 'Starting a coin flip run on the SKIFFLE demo snapsite 🪙'
	: state.heads === state.tails
		? `Coin flip is tied ${state.heads}-${state.tails} after ${state.flips} flips on the SKIFFLE demo snapsite 🪙`
	: state.heads > state.tails
		? `Heads leads ${state.heads}-${state.tails} after ${state.flips} flips on the SKIFFLE demo snapsite 🪙`
	:
		`Tails leads ${state.tails}-${state.heads} after ${state.flips} flips on the SKIFFLE demo snapsite 🪙`
)

export const nextCoinFlipState = (state: CoinFlipState): CoinFlipState => {
	const lastResult = flipResult(state.seed, state.flips + 1)

	return {
		seed: normalizeSeed(nextRandom(state.seed)),
		flips: clampCount(state.flips + 1),
		heads: clampCount(state.heads + (lastResult === 'heads' ? 1 : 0)),
		tails: clampCount(state.tails + (lastResult === 'tails' ? 1 : 0)),
		edge: clampCount(state.edge + (lastResult === 'edge' ? 1 : 0)),
		history: `${state.history}${historyCode(lastResult)}`.slice(-HISTORY_LIMIT),
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
	edge: 0,
	history: '',
})

const coinFlipTargetParams = (state: CoinFlipState) => (
	new URLSearchParams({
		seed: String(state.seed),
		flips: String(state.flips),
		heads: String(state.heads),
		tails: String(state.tails),
		edge: String(state.edge),
		history: state.history,
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
			targetUrl: demosBackUrl('coin-flip'),
		},
		{
			label: 'Flip',
			action: 'post',
			targetUrl: `/demos/coin-flip?/flip&${coinFlipTargetParams(state)}`,
		},
		state.flips > 0 && {
			label: 'Reset',
			action: 'post',
			targetUrl: '/demos/coin-flip',
		},
	),
})

export const buildCoinFlipSnap = (state: CoinFlipState): AppSnapPage => ({
	castIntent: {
		text: coinFlipShareText(state),
	},
	theme: {
		accent: (
			state.lastResult === 'edge'
				? SnapPaletteColors.Pink
			: state.lastResult === 'heads'
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
					targetUrl: demosBackUrl('coin-flip'),
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
							targetUrl: '/demos/coin-flip',
						}),
					],
				}),
			]
			: []),
	],
})
