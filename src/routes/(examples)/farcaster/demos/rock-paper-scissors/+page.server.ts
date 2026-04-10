// Functions
import {
	buildRockPaperScissorsFrame,
	nextRockPaperScissorsState,
	parseRockPaperScissorsState,
	parseRpsPick,
	rockPaperScissorsStateFromHref,
	rockPaperScissorsSummary,
} from './rock-paper-scissors-frame'

// Data
import type { Actions, PageServerLoad } from './$types'

const EMPTY_STATE = {
	rounds: 0,
	wins: 0,
	losses: 0,
	draws: 0,
} as const

export const load: PageServerLoad = async ({ url }) => {
	const state = parseRockPaperScissorsState(url)
	return {
		...state,
		summary: rockPaperScissorsSummary(state),
		frame: buildRockPaperScissorsFrame(state),
	}
}

export const actions: Actions = {
	open: async () => ({
		frame: buildRockPaperScissorsFrame(EMPTY_STATE),
	}),
	play: async ({ locals, url }) => {
		const state = (
			rockPaperScissorsStateFromHref(locals.frameSignaturePacket?.untrustedData.url)
			?? parseRockPaperScissorsState(url)
		)

		return {
			frame: buildRockPaperScissorsFrame(
				nextRockPaperScissorsState(
					state,
					parseRpsPick(url.searchParams.get('pick')),
					locals.farcasterViewerFid ?? 0,
				),
			),
		}
	},
}
