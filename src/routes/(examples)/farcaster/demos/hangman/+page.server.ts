// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import { redirect } from '@sveltejs/kit'

// Functions
import {
	buildHangmanFrame,
	freshHangmanState,
	hangmanStateFromHref,
	nextHangmanState,
	parseHangmanState,
} from './hangman-frame'

export const load: PageServerLoad = ({ url }) => {
	const state = parseHangmanState(url)
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
		frame: buildHangmanFrame(state),
	}
}

export const actions: Actions = {
	open: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshHangmanState(farcasterViewerFid ?? Date.now())

		return {
			...state,
			frame: buildHangmanFrame(state),
		}
	},

	guess: async ({
		request,
		locals: { frameSignaturePacket },
		url,
	}) => {
		const input = String((await request.formData()).get('inputText') ?? '')
		const state = (
			hangmanStateFromHref(frameSignaturePacket?.untrustedData.url)
			?? parseHangmanState(url)
		)
		const next = nextHangmanState(state, input)

		return {
			...next,
			frame: buildHangmanFrame(next),
		}
	},
}
