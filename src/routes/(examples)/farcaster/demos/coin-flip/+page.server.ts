// Functions
import {
	buildCoinFlipFrame,
	coinFlipSummary,
	nextCoinFlipState,
	parseCoinFlipGuess,
	parseCoinFlipState,
	stateFromHref,
} from './coin-flip-frame'

// Data
import type { Actions, PageServerLoad } from './$types'

const EMPTY_STATE = {
	rounds: 0,
	wins: 0,
	losses: 0,
} as const

export const load: PageServerLoad = async ({ url }) => {
	const state = parseCoinFlipState(url)
	return {
		...state,
		summary: coinFlipSummary(state),
		frame: buildCoinFlipFrame(state),
	}
}

export const actions: Actions = {
	open: async () => ({
		frame: buildCoinFlipFrame(EMPTY_STATE),
	}),
	guess: async ({ locals, url }) => {
		const state = (
			stateFromHref(locals.frameSignaturePacket?.untrustedData.url)
			?? parseCoinFlipState(url)
		)
		return {
			frame: buildCoinFlipFrame(
				nextCoinFlipState(
					state,
					parseCoinFlipGuess(url.searchParams.get('guess')),
					locals.farcasterViewerFid ?? 0,
				),
			),
		}
	},
}
