// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import {
	buildCoinFlipFrame,
	buildCoinFlipSnap,
	coinFlipFace,
	coinFlipHistoryBadges,
	coinFlipMessage,
	coinFlipStateFromHref,
	freshCoinFlipState,
	nextCoinFlipState,
	parseCoinFlipState,
} from './coin-flip-frame'

export const load: PageServerLoad = ({ url }) => {
	const state = parseCoinFlipState(url)

	return {
		title: 'Coin Flip',
		...state,
		face: coinFlipFace(state),
		hasEdge: state.edge > 0,
		historyBadges: coinFlipHistoryBadges(state),
		message: coinFlipMessage(state),
		frame: buildCoinFlipFrame(state),
		snap: buildCoinFlipSnap(state),
	}
}

export const actions: Actions = {
	default: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshCoinFlipState(farcasterViewerFid ?? Date.now())

		return {
			...state,
			hasEdge: state.edge > 0,
			historyBadges: coinFlipHistoryBadges(state),
			frame: buildCoinFlipFrame(state),
			snap: buildCoinFlipSnap(state),
		}
	},
	flip: async ({
		locals: { frameSignaturePacket },
		url,
	}) => {
		const state = (
			coinFlipStateFromHref(frameSignaturePacket?.untrustedData.url)
			?? parseCoinFlipState(url)
		)
		const next = nextCoinFlipState(state)

		return {
			...next,
			hasEdge: next.edge > 0,
			historyBadges: coinFlipHistoryBadges(next),
			frame: buildCoinFlipFrame(next),
			snap: buildCoinFlipSnap(next),
		}
	},
}
