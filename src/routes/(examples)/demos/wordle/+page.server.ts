// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import { redirect } from '@sveltejs/kit'

// Functions
import {
	buildWordleFrame,
	buildWordleSnap,
	freshWordleState,
	nextWordleState,
	parseWordleState,
	wordleMessage,
	wordleRows,
	wordleStateFromHref,
} from './wordle-frame'

export const load: PageServerLoad = ({ url }) => {
	const state = parseWordleState(url)
	if (
		!url.searchParams.has('status')
		&& (state.status === 'win' || state.status === 'loss')
	) {
		const canonicalUrl = new URL(url)
		canonicalUrl.searchParams.set('status', state.status)
		redirect(307, canonicalUrl)
	}

	return {
		title: 'Wordle',
		...state,
		message: wordleMessage(state),
		rows: wordleRows(state),
		frame: buildWordleFrame(state),
		snap: buildWordleSnap(state),
	}
}

export const actions: Actions = {
	start: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshWordleState(farcasterViewerFid ?? Date.now())

		return {
			...state,
			frame: buildWordleFrame(state),
			snap: buildWordleSnap(state),
		}
	},

	guess: async ({
		request,
		locals: { frameSignaturePacket },
		url,
	}) => {
		const input = String((await request.formData()).get('inputText') ?? '')
		const state = (
			wordleStateFromHref(frameSignaturePacket?.untrustedData.url)
			?? parseWordleState(url)
		)
		const next = nextWordleState(state, input)

		return {
			...next,
			frame: buildWordleFrame(next),
			snap: buildWordleSnap(next),
		}
	},
}
