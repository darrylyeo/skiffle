// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import { redirect } from '@sveltejs/kit'
import { snapGridSelection } from '$/lib/snap-grid'

// Functions
import {
	buildHangmanFrame,
	buildHangmanSnap,
	freshHangmanState,
	hangmanLetters,
	hangmanLives,
	hangmanMessage,
	hangmanStateFromHref,
	hangmanMisses,
	nextHangmanState,
	parseHangmanState,
} from './hangman-frame'

const HANGMAN_GRID_COLUMNS = 9
const HANGMAN_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const hangmanLetterFromGridSelection = (value: unknown): string => {
	if (typeof value === 'string') {
		const trimmed = value.trim()

		if (/^[a-z]$/i.test(trimmed)) {
			return trimmed.toLowerCase()
		}

		const fromString = snapGridSelection(trimmed)

		if (fromString) {
			return HANGMAN_ALPHABET[fromString.row * HANGMAN_GRID_COLUMNS + fromString.col] ?? ''
		}

		return ''
	}

	if (Array.isArray(value)) {
		return hangmanLetterFromGridSelection(value[0])
	}

	const selection = snapGridSelection(value)

	if (selection) {
		return HANGMAN_ALPHABET[selection.row * HANGMAN_GRID_COLUMNS + selection.col] ?? ''
	}

	return ''
}

const actionGuess = async ({
	locals,
	request,
}: {
	locals: {
		snapJfsInputs?: Record<string, unknown>
		frameSignaturePacket?: {
			untrustedData?: {
				inputText?: string
				hangmanLetter?: unknown
			}
		}
	}
	request: Request
}) => (
	hangmanLetterFromGridSelection(
		locals.snapJfsInputs?.hangmanLetter
		?? locals.frameSignaturePacket?.untrustedData?.hangmanLetter
		?? locals.frameSignaturePacket?.untrustedData?.inputText,
	)
	|| await request
		.formData()
		.then((formData) => (
			hangmanLetterFromGridSelection(
				formData.get('hangmanLetter')
				?? formData.get('inputText'),
			)
			|| String(formData.get('inputText') ?? '').trim()
		))
		.catch(() => '')
)

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
		title: 'Hangman',
		...state,
		letters: hangmanLetters(state),
		lives: hangmanLives(state),
		message: hangmanMessage(state),
		misses: hangmanMisses(state),
		frame: buildHangmanFrame(state),
		snap: buildHangmanSnap(state),
	}
}

export const actions: Actions = {
	start: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshHangmanState(farcasterViewerFid ?? Date.now())

		return {
			...state,
			frame: buildHangmanFrame(state),
			snap: buildHangmanSnap(state),
		}
	},

	guess: async ({
		request,
		locals,
		url,
	}) => {
		const state = (
			hangmanStateFromHref(locals.frameSignaturePacket?.untrustedData.url)
			?? parseHangmanState(url)
		)
		const next = nextHangmanState(
			state,
			await actionGuess({
				locals,
				request,
			}),
		)

		return {
			...next,
			frame: buildHangmanFrame(next),
			snap: buildHangmanSnap(next),
		}
	},
}
