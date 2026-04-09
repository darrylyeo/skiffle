// Types
import type { FrameMeta } from '$/lib/frame'

type CoinSide = 'heads' | 'tails'

type CoinFlipState = {
	rounds: number,
	wins: number,
	losses: number,
	lastFlip?: CoinSide,
	lastGuess?: CoinSide,
}

const clamp = (value: number) => (
	Math.max(0, Math.min(9_999, Number.isFinite(value) ? Math.floor(value) : 0))
)

const parseSide = (value: string | null | undefined): CoinSide | undefined => (
	value === 'heads' || value === 'tails'
		? value
		: undefined
)

const sideForRound = (
	round: number,
	fid: number,
): CoinSide => (
	((round * 17 + fid * 31) % 2) === 0
		? 'heads'
		: 'tails'
)

export const parseCoinFlipState = (url: URL): CoinFlipState => ({
	rounds: clamp(Number(url.searchParams.get('rounds') ?? 0)),
	wins: clamp(Number(url.searchParams.get('wins') ?? 0)),
	losses: clamp(Number(url.searchParams.get('losses') ?? 0)),
	lastFlip: parseSide(url.searchParams.get('lastFlip')),
	lastGuess: parseSide(url.searchParams.get('lastGuess')),
})

export const buildCoinFlipFrame = ({
	rounds,
	wins,
	losses,
	lastFlip,
	lastGuess,
}: CoinFlipState): FrameMeta => ({
	image: {
		url: `/farcaster/demos/coin-flip?${new URLSearchParams({
			rounds: String(rounds),
			wins: String(wins),
			losses: String(losses),
			...(lastFlip ? { lastFlip } : {}),
			...(lastGuess ? { lastGuess } : {}),
		})}`,
		aspectRatio: '1.91:1',
	},
	buttons: [
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: '/?/demos',
		},
		{
			label: 'Heads',
			action: 'post',
			targetUrl: `/farcaster/demos/coin-flip?/guess&guess=heads&rounds=${rounds}&wins=${wins}&losses=${losses}`,
		},
		{
			label: 'Tails',
			action: 'post',
			targetUrl: `/farcaster/demos/coin-flip?/guess&guess=tails&rounds=${rounds}&wins=${wins}&losses=${losses}`,
		},
		{
			label: 'Reset',
			action: 'post',
			targetUrl: '/farcaster/demos/coin-flip?/open',
		},
	],
})

export const coinFlipSummary = ({
	wins,
	losses,
	lastFlip,
	lastGuess,
}: CoinFlipState) => (
	lastFlip && lastGuess
		? `${lastGuess === lastFlip ? 'Correct' : 'Miss'}: ${lastGuess} vs ${lastFlip}`
	: wins + losses > 0
		? 'Pick heads or tails.'
	:
		'Pick heads or tails to start.'
)

export const nextCoinFlipState = (
	state: CoinFlipState,
	guess: CoinSide | undefined,
	fid: number,
): CoinFlipState => {
	if (!guess) {
		return state
	}

	const rounds = clamp(state.rounds + 1)
	const flip = sideForRound(rounds, fid)
	const wins = clamp(state.wins + (guess === flip ? 1 : 0))
	const losses = clamp(state.losses + (guess === flip ? 0 : 1))

	return {
		rounds,
		wins,
		losses,
		lastFlip: flip,
		lastGuess: guess,
	}
}

export const stateFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return parseCoinFlipState(new URL(href))
	} catch {
		return undefined
	}
}

export const parseCoinFlipGuess = (value: string | null | undefined) => (
	parseSide(value)
)
