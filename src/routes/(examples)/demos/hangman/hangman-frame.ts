// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'
import { demosBackUrl } from '$/routes/(examples)/demos'

// Functions
import { isTruthy } from '$/lib/isTruthy'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { frameButtons } from '$/lib/frame'
import { SnapButtonVariants, SnapDirections, SnapEffects, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

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

export const hangmanCanGuess = (status: HangmanStatus) => (
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
		? 'I solved the word.'
	: status === 'loss'
		? `Out of lives. The word was ${WORDS[word].toUpperCase()}.`
	: status === 'invalid'
		? 'Enter one unused letter from A to Z.'
	: status === 'repeat'
		? 'I already guessed that letter.'
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
		url: `/demos/hangman?word=${word}&guesses=${guesses}&status=${status}`,
		aspectRatio: '1:1',
	},
	textInput: hangmanCanGuess(status) ? 'Guess a letter' : undefined,
	buttons: frameButtons(
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: demosBackUrl('hangman'),
		},
		hangmanCanGuess(status) && {
			label: status === 'invalid' || status === 'repeat' ? 'Try Again' : 'Guess',
			action: 'post',
			targetUrl: `/demos/hangman?/guess&word=${word}&guesses=${guesses}`,
		},
		(guesses.length > 0 || !hangmanCanGuess(status)) && {
			label: status === 'win' || status === 'loss' ? 'Play Again' : 'Reset',
			action: 'post',
			targetUrl: '/demos/hangman?/start',
		},
	),
})

export const buildHangmanSnap = ({
	word,
	guesses,
	status,
}: HangmanState): AppSnapPage => ({
	effects: status === 'win' ? [SnapEffects.Confetti] : undefined,
	castIntent: {
		text: `Playing Hangman on the SKIFFLE demo snapsite. ${hangmanMessage({ word, guesses, status })} 🪢`,
	},
	theme: {
		accent: (
			status === 'win' ?
				SnapPaletteColors.Green
			: status === 'loss' || status === 'invalid' || status === 'repeat' ?
				SnapPaletteColors.Red
			:
				SnapPaletteColors.Amber
		),
	},
	buttons: [
		snapButtonGroup({
			direction: SnapDirections.Horizontal,
			gap: SnapGaps.Sm,
			justify: SnapJustifyValues.Center,
			children: [
				snapTargetButton({
					label: '‹ Demos',
					role: AppSnapButtonRoles.Back,
					action: 'post',
					targetUrl: demosBackUrl('hangman'),
				}),
				hangmanCanGuess(status) && snapTargetButton({
					label: status === 'invalid' || status === 'repeat' ? 'Try Again' : 'Guess',
					role: AppSnapButtonRoles.Cta,
					variant: SnapButtonVariants.Primary,
					action: 'post',
					targetUrl: `/demos/hangman?/guess&word=${word}&guesses=${guesses}`,
				}),
			].filter(isTruthy),
		}),
		...(guesses.length > 0 || !hangmanCanGuess(status)
			? [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: [
						snapTargetButton({
							label: status === 'win' || status === 'loss' ? 'Play Again' : 'Reset',
							action: 'post',
							targetUrl: '/demos/hangman?/start',
						}),
					],
				}),
			]
			: []),
	],
})

export const nextHangmanState = (
	state: HangmanState,
	input: string | undefined,
): HangmanState => {
	if (!hangmanCanGuess(state.status)) {
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
