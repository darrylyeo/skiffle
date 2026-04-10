// Types
import type { Actions, PageServerLoad } from './$types'

// Functions
import { redirect } from '@sveltejs/kit'

// Functions
import {
	buildHangmanFrame,
	buildHangmanSnap,
	freshHangmanState,
	hangmanLetters,
	hangmanLives,
	hangmanMessage,
	hangmanStateFromHref,
	hangmanUsedLetters,
	hangmanMisses,
	nextHangmanState,
	parseHangmanState,
} from './hangman-frame'

const HANGMAN_GRID_COLUMNS = 7
const HANGMAN_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

const isRecord = (value: unknown): value is Record<string, unknown> => (
	typeof value === 'object'
	&& value !== null
)

const hangmanLetterFromGridSelection = (value: unknown): string => {
	if (typeof value === 'string') {
		const trimmed = value.trim()

		if (/^[a-z]$/i.test(trimmed)) {
			return trimmed.toLowerCase()
		}

		try {
			return hangmanLetterFromGridSelection(JSON.parse(trimmed))
		} catch {
			return ''
		}
	}

	if (Array.isArray(value)) {
		return hangmanLetterFromGridSelection(value[0])
	}

	if (
		isRecord(value)
		&& typeof value.row === 'number'
		&& typeof value.col === 'number'
	) {
		return HANGMAN_ALPHABET[value.row * HANGMAN_GRID_COLUMNS + value.col] ?? ''
	}

	return ''
}

const actionGuess = async (request: Request) => {
	const formData = await request.formData()

	return (
		hangmanLetterFromGridSelection(formData.get('hangmanLetter'))
		|| String(formData.get('inputText') ?? '').trim()
	)
}

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
		usedLetters: hangmanUsedLetters(state),
		frame: buildHangmanFrame(state),
		snap: buildHangmanSnap(state),
	}
}

export const actions: Actions = {
	open: async ({ locals: { farcasterViewerFid } }) => {
		const state = freshHangmanState(farcasterViewerFid ?? Date.now())

		return {
			...state,
			frame: buildHangmanFrame(state),
			snap: buildHangmanSnap(state),
		}
	},

	guess: async ({
		request,
		locals: { frameSignaturePacket },
		url,
	}) => {
		const state = (
			hangmanStateFromHref(frameSignaturePacket?.untrustedData.url)
			?? parseHangmanState(url)
		)
		const next = nextHangmanState(state, await actionGuess(request))

		return {
			...next,
			frame: buildHangmanFrame(next),
			snap: buildHangmanSnap(next),
		}
	},
}
