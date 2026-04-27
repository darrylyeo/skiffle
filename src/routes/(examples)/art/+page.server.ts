// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import {
	abstractArtDocumentTitle,
	abstractArtStateFromHref,
	abstractArtView,
	buildAbstractArtFrame,
	buildAbstractArtSnap,
	freshAbstractArtState,
	nextAbstractArtPalette,
	nextAbstractArtSeed,
	parseAbstractArtState,
} from './abstract-art-frame'

export const load: PageServerLoad = ({ url }) => {
	const state = parseAbstractArtState(url)
	const view = abstractArtView(state)

	return {
		...state,
		...view,
		title: abstractArtDocumentTitle(state),
		frame: buildAbstractArtFrame(state),
		snap: buildAbstractArtSnap(state),
	}
}

export const actions: Actions = {
	open: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshAbstractArtState(farcasterViewerFid ?? Date.now())

		return {
			title: abstractArtDocumentTitle(state),
			...state,
			frame: buildAbstractArtFrame(state),
			snap: buildAbstractArtSnap(state),
		}
	},
	remix: async ({
		locals: { frameSignaturePacket },
		url,
	}) => {
		const state = (
			abstractArtStateFromHref(frameSignaturePacket?.untrustedData.url)
			?? parseAbstractArtState(url)
		)
		const next = {
			seed: nextAbstractArtSeed(state),
			palette: state.palette,
		}

		return {
			title: abstractArtDocumentTitle(next),
			...next,
			frame: buildAbstractArtFrame(next),
			snap: buildAbstractArtSnap(next),
		}
	},
	palette: async ({
		locals: { frameSignaturePacket },
		url,
	}) => {
		const state = (
			abstractArtStateFromHref(frameSignaturePacket?.untrustedData.url)
			?? parseAbstractArtState(url)
		)
		const next = {
			seed: state.seed,
			palette: nextAbstractArtPalette(state.palette),
		}

		return {
			title: abstractArtDocumentTitle(next),
			...next,
			frame: buildAbstractArtFrame(next),
			snap: buildAbstractArtSnap(next),
		}
	},
}
