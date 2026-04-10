// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import {
	buildCoinFlipFrame,
	buildCoinFlipSnap,
	coinFlipFace,
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
		message: coinFlipMessage(state),
		frame: buildCoinFlipFrame(state),
		snap: buildCoinFlipSnap(state),
	}
}

export const actions: Actions = {
	open: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshCoinFlipState(farcasterViewerFid ?? Date.now())

		return {
			...state,
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
			frame: buildCoinFlipFrame(next),
			snap: buildCoinFlipSnap(next),
		}
	},
}
