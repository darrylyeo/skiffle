// Types
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'

type HangmanStatus = 'turn' | 'invalid' | 'repeat' | 'win' | 'loss'

type HangmanState = {
	word: number,
	guesses: string,
	status: HangmanStatus,
}

export type HangmanLetter = {
	id: string,
	label: string,
	revealed: boolean,
}

export type HangmanUsedLetter = {
	id: string,
	label: string,
	hit: boolean,
}

const WORDS = [
	'svelte',
	'caster',
	'signal',
	'frames',
	'layout',
	'snappy',
] as const

const MAX_MISSES = 6

const canGuess = (status: HangmanStatus) => (
	status === 'turn' || status === 'invalid' || status === 'repeat'
)

const normalizeWordIndex = (value: number) => (
	((Number.isFinite(value) ? Math.floor(value) : 0) % WORDS.length + WORDS.length) % WORDS.length
)

const normalizeGuesses = (value: string | null | undefined) => (
	[...(value ?? '').toLowerCase()]
		.filter((letter, index, letters) => (
			letter >= 'a'
			&& letter <= 'z'
			&& letters.indexOf(letter) === index
		))
		.join('')
)

const normalizeStatus = (value: string | null | undefined): HangmanStatus => (
	value === 'invalid' || value === 'repeat' || value === 'win' || value === 'loss'
		? value
	:
		'turn'
)

const lettersForWord = (wordIndex: number) => (
	[...WORDS[normalizeWordIndex(wordIndex)]]
)

const missesForState = (
	wordIndex: number,
	guesses: string,
) => (
	[...guesses].filter((letter) => !WORDS[normalizeWordIndex(wordIndex)].includes(letter))
)

const terminalStatus = (
	wordIndex: number,
	guesses: string,
) => (
	lettersForWord(wordIndex).every((letter) => guesses.includes(letter))
		? 'win'
	: missesForState(wordIndex, guesses).length >= MAX_MISSES
		? 'loss'
	:
		'turn'
) satisfies HangmanStatus

export const parseHangmanState = (url: URL): HangmanState => {
	const word = normalizeWordIndex(Number(url.searchParams.get('word') ?? 0))
	const guesses = normalizeGuesses(url.searchParams.get('guesses'))
	const terminal = terminalStatus(word, guesses)

	return {
		word,
		guesses,
		status: terminal === 'turn'
			? normalizeStatus(url.searchParams.get('status'))
			: terminal,
	}
}

export const hangmanMessage = ({
	word,
	guesses,
	status,
}: HangmanState) => (
	status === 'win'
		? 'You saved the word.'
	: status === 'loss'
		? `Out of lives. The word was ${WORDS[word].toUpperCase()}.`
	: status === 'invalid'
		? 'Enter one unused letter from A to Z.'
	: status === 'repeat'
		? 'You already guessed that letter.'
	:
		`${MAX_MISSES - missesForState(word, guesses).length} lives left.`
)

export const hangmanLetters = ({
	word,
	guesses,
	status,
}: HangmanState): HangmanLetter[] => (
	lettersForWord(word).map((letter, index) => ({
		id: `${word}:${index}`,
		label: guesses.includes(letter) || status === 'loss'
			? letter.toUpperCase()
			: ' ',
		revealed: guesses.includes(letter) || status === 'loss',
	}))
)

export const hangmanMisses = ({
	word,
	guesses,
}: HangmanState) => (
	missesForState(word, guesses).map((letter) => letter.toUpperCase())
)

export const hangmanUsedLetters = ({
	word,
	guesses,
}: HangmanState): HangmanUsedLetter[] => (
	[...guesses].map((letter, index) => ({
		id: `${letter}:${index}`,
		label: letter.toUpperCase(),
		hit: WORDS[normalizeWordIndex(word)].includes(letter),
	}))
)

export const hangmanLives = ({
	word,
	guesses,
}: HangmanState) => (
	Array.from(
		{ length: MAX_MISSES },
		(_, index) => (
			index >= missesForState(word, guesses).length
		),
	)
)

export const buildHangmanFrame = ({
	word,
	guesses,
	status,
}: HangmanState): FrameMeta => ({
	image: {
		url: `/farcaster/demos/hangman?word=${word}&guesses=${guesses}&status=${status}`,
		aspectRatio: '1.91:1',
	},
	textInput: canGuess(status) ? 'Guess a letter' : undefined,
	buttons: [
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: '/?/demos',
		},
		canGuess(status) && {
			label: status === 'invalid' || status === 'repeat' ? 'Try Again' : 'Guess',
			action: 'post',
			targetUrl: `/farcaster/demos/hangman?/guess&word=${word}&guesses=${guesses}`,
		},
		(guesses.length > 0 || !canGuess(status)) && {
			label: status === 'win' || status === 'loss' ? 'Play Again' : 'Reset',
			action: 'post',
			targetUrl: '/farcaster/demos/hangman?/open',
		},
	].filter(isTruthy),
})

export const nextHangmanState = (
	state: HangmanState,
	input: string | undefined,
): HangmanState => {
	if (!canGuess(state.status)) {
		return state
	}

	const letter = (input ?? '').trim().toLowerCase()
	if (!/^[a-z]$/.test(letter)) {
		return {
			...state,
			status: 'invalid',
		}
	}

	if (state.guesses.includes(letter)) {
		return {
			...state,
			status: 'repeat',
		}
	}

	const guesses = `${state.guesses}${letter}`
	const status = terminalStatus(state.word, guesses)

	return {
		word: state.word,
		guesses,
		status,
	}
}

export const hangmanStateFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return parseHangmanState(new URL(href))
	} catch {
		return undefined
	}
}

export const freshHangmanState = (seed: number) => ({
	word: normalizeWordIndex(seed),
	guesses: '',
	status: 'turn',
}) satisfies HangmanState
