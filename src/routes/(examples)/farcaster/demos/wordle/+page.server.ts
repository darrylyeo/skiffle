// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import { redirect } from '@sveltejs/kit'

// Functions
import {
	buildWordleFrame,
	freshWordleState,
	nextWordleState,
	parseWordleState,
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
		...state,
		frame: buildWordleFrame(state),
	}
}

export const actions: Actions = {
	open: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshWordleState(farcasterViewerFid ?? Date.now())

		return {
			...state,
			frame: buildWordleFrame(state),
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
		}
	},
}
