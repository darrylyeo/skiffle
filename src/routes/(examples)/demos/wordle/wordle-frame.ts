// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'
import { demosBackUrl } from '$/routes/(examples)/demos'

// Functions
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { frameButtons } from '$/lib/frame'
import { SnapButtonVariants, SnapDirections, SnapEffects, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

type WordleStatus = 'turn' | 'invalid' | 'repeat' | 'win' | 'loss'

type WordleState = {
	word: string,
	guesses: string[],
	status: WordleStatus,
}

export type WordleCell = {
	id: string,
	letter: string,
	state: 'correct' | 'present' | 'miss' | 'empty',
}

export type WordleUsedLetter = {
	id: string,
	letter: string,
	state: 'correct' | 'present' | 'miss',
}

const WORDS = [
	'frame',
	'casts',
	'spark',
	'align',
	'pitch',
	'sound',
	'snaps',
	'chain',
	'token',
	'share',
	'route',
	'proxy',
	'reply',
	'embed',
	'focal',
	'nodes',
] as const

const WORD_HASH_SALT = 'SKIFFLE'
const MAX_GUESSES = 6

const canGuess = (status: WordleStatus) => (
	status === 'turn' || status === 'invalid' || status === 'repeat'
)

const normalizeWordIndex = (value: number) => (
	((Number.isFinite(value) ? Math.floor(value) : 0) % WORDS.length + WORDS.length) % WORDS.length
)

const saltedWordHash = (word: string) => (
	[...`${WORD_HASH_SALT}:${word}`]
		.reduce((hash, char) => (
			Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0
		), 2166136261)
		.toString(10)
)

const WORD_INDEX_BY_HASH = new Map(
	WORDS.map((word, index) => [saltedWordHash(word), index] as const)
)

const normalizeWordRef = (value: string | null | undefined) => (
	value && WORD_INDEX_BY_HASH.has(value)
		? WORDS[WORD_INDEX_BY_HASH.get(value) ?? 0]
	:
		WORDS[0]
)

const wordRef = (word: string) => (
	saltedWordHash(word)
)

const normalizeGuess = (value: string) => (
	value.trim().toLowerCase()
)

const normalizeGuesses = (value: string | null | undefined) => (
	(value ?? '')
		.split(',')
		.map(normalizeGuess)
		.filter((guess, index, guesses) => (
			/^[a-z]{5}$/.test(guess)
			&& guesses.indexOf(guess) === index
		))
		.slice(0, MAX_GUESSES)
)

const normalizeStatus = (value: string | null | undefined): WordleStatus => (
	value === 'invalid' || value === 'repeat' || value === 'win' || value === 'loss'
		? value
	:
		'turn'
)

const terminalStatus = (
	word: string,
	guesses: string[],
) => (
	guesses.at(-1) === word
		? 'win'
	: guesses.length >= MAX_GUESSES
		? 'loss'
	:
		'turn'
) satisfies WordleStatus

export const parseWordleState = (url: URL): WordleState => {
	const word = normalizeWordRef(url.searchParams.get('word'))
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

const evaluationForGuess = (
	word: string,
	guess: string,
) => {
	const states: WordleCell['state'][] = Array.from({ length: guess.length }, () => 'miss')
	const leftover = new Map<string, number>()

	for (const [index, letter] of [...word].entries()) {
		if (guess[index] === letter) {
			states[index] = 'correct'
			continue
		}

		leftover.set(letter, (leftover.get(letter) ?? 0) + 1)
	}

	for (const [index, letter] of [...guess].entries()) {
		if (states[index] !== 'miss') {
			continue
		}

		const remaining = leftover.get(letter) ?? 0
		if (remaining > 0) {
			states[index] = 'present'
			leftover.set(letter, remaining - 1)
		}
	}

	return states
}

const mergedWordleLetterState = (
	current: WordleUsedLetter['state'] | undefined,
	next: WordleUsedLetter['state'],
) => (
	current === 'correct' || next === 'correct' ?
		'correct'
	: current === 'present' || next === 'present' ?
		'present'
	:
		'miss'
)

export const wordleRows = ({
	word,
	guesses,
}: WordleState): WordleCell[][] => {
	const target = word

	return Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
		const guess = guesses[rowIndex] ?? ''
		const states = guess
			? evaluationForGuess(target, guess)
			: Array.from({ length: target.length }, () => 'empty' as const)

		return Array.from({ length: target.length }, (_, columnIndex) => ({
			id: `${rowIndex}:${columnIndex}`,
			letter: guess[columnIndex]?.toUpperCase() ?? '',
			state: states[columnIndex],
		}))
	})
}

export const wordleUsedLetters = ({
	word,
	guesses,
}: WordleState): WordleUsedLetter[] => {
	const letters = new Map<string, WordleUsedLetter['state']>()
	const target = word

	for (const guess of guesses) {
		for (const [index, letter] of [...guess.toUpperCase()].entries()) {
			const state = evaluationForGuess(target, guess)[index]

			if (state !== 'empty') {
				letters.set(
					letter,
					mergedWordleLetterState(
						letters.get(letter),
						state,
					),
				)
			}
		}
	}

	return [...letters.entries()].map(([letter, state], index) => ({
		id: `${letter}:${index}`,
		letter,
		state,
	}))
}

export const wordleMessage = ({
	word,
	guesses,
	status,
}: WordleState) => (
	status === 'win'
		? `Solved in ${guesses.length} guess${guesses.length === 1 ? '' : 'es'}.`
	: status === 'loss'
		? `Out of rows. The word was ${word.toUpperCase()}.`
	: status === 'invalid'
		? 'Enter one 5-letter word.'
	: status === 'repeat'
		? 'Try a different guess.'
	:
		`${MAX_GUESSES - guesses.length} guesses left.`
)

export const buildWordleFrame = ({
	word,
	guesses,
	status,
}: WordleState): FrameMeta => ({
	image: {
		url: `/demos/wordle?word=${wordRef(word)}&guesses=${guesses.join(',')}&status=${status}`,
		aspectRatio: '1:1',
	},
	textInput: canGuess(status) ? 'Enter a 5-letter word' : undefined,
	buttons: frameButtons(
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: demosBackUrl('wordle'),
		},
		canGuess(status) && {
			label: status === 'invalid' || status === 'repeat' ? 'Try Again' : 'Guess',
			action: 'post',
			targetUrl: `/demos/wordle?/guess&word=${wordRef(word)}&guesses=${guesses.join(',')}`,
		},
		(guesses.length > 0 || !canGuess(status)) && {
			label: status === 'win' || status === 'loss' ? 'Play Again' : 'Reset',
			action: 'post',
			targetUrl: '/demos/wordle?/start',
		},
	),
})

export const buildWordleSnap = ({
	word,
	guesses,
	status,
}: WordleState): AppSnapPage => ({
	effects: status === 'win' ? [SnapEffects.Confetti] : undefined,
	castIntent: {
		text: `Playing Wordle on the SKIFFLE demo snapsite. ${wordleMessage({ word, guesses, status })} 🟩`,
	},
	theme: {
		accent: (
			status === 'win' ?
				SnapPaletteColors.Green
			: status === 'loss' || status === 'invalid' ?
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
			children: (
				[
					snapTargetButton({
						label: '‹ Demos',
						role: AppSnapButtonRoles.Back,
						action: 'post',
						targetUrl: demosBackUrl('wordle'),
					}),
					...(canGuess(status)
						? [
							snapTargetButton({
								label: status === 'invalid' || status === 'repeat' ? 'Try Again' : 'Guess',
								role: AppSnapButtonRoles.Cta,
								variant: SnapButtonVariants.Primary,
								action: 'post',
								targetUrl: `/demos/wordle?/guess&word=${wordRef(word)}&guesses=${guesses.join(',')}`,
							}),
						]
						: []),
					...(guesses.length > 0 || !canGuess(status)
						? [
							snapTargetButton({
								label: status === 'win' || status === 'loss' ? 'Play Again' : 'Reset',
								variant: (
									!canGuess(status) ?
										SnapButtonVariants.Primary
									:
										SnapButtonVariants.Secondary
								),
								action: 'post',
								targetUrl: '/demos/wordle?/start',
							}),
						]
						: []),
				]
			),
		}),
	],
})

export const nextWordleState = (
	state: WordleState,
	input: string | undefined,
): WordleState => {
	if (!canGuess(state.status)) {
		return state
	}

	const guess = normalizeGuess(input ?? '')
	if (!/^[a-z]{5}$/.test(guess)) {
		return {
			...state,
			status: 'invalid',
		}
	}

	if (state.guesses.includes(guess)) {
		return {
			...state,
			status: 'repeat',
		}
	}

	const guesses = [...state.guesses, guess]
	const status = terminalStatus(state.word, guesses)

	return {
		word: state.word,
		guesses,
		status,
	}
}

export const wordleStateFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return parseWordleState(new URL(href))
	} catch {
		return undefined
	}
}

export const freshWordleState = (seed: number) => ({
	word: WORDS[normalizeWordIndex(seed)],
	guesses: [],
	status: 'turn',
}) satisfies WordleState
