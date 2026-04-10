// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'
import { SnapAlignments, SnapPaletteColors, SnapTextSizes } from '$/lib/snap-spec'

import { hangmanCanGuess, hangmanMisses, hangmanUsedLetters, parseHangmanState } from './hangman-frame'

const HANGMAN_GRID_COLUMNS = 7
const HANGMAN_GRID_ROW_HEIGHT = 24
const HANGMAN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const hangmanSnapExtraElements = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)
		if (stateUrl.pathname !== '/demos/hangman') {
			return undefined
		}

		const state = parseHangmanState(stateUrl)
		const misses = hangmanMisses(state)
		const usedLetters = hangmanUsedLetters(state)
		const canGuess = hangmanCanGuess(state.status)

		return {
			hideInput: canGuess,
			children: [
				...(canGuess
					? [
						'hangman-picker-label',
						'hangman-picker-grid',
					]
					: []),
				'hangman-used',
				...(misses.length ? ['hangman-misses'] : []),
			],
			elements: {
				...(canGuess
					? {
						'hangman-picker-label': {
							type: 'text',
							props: {
								content: 'Pick a letter',
								size: SnapTextSizes.Sm,
								align: SnapAlignments.Center,
							},
						},
						'hangman-picker-grid': {
							type: 'cell_grid',
							props: {
								name: 'hangmanLetter',
								cols: HANGMAN_GRID_COLUMNS,
								rows: Math.ceil(HANGMAN_ALPHABET.length / HANGMAN_GRID_COLUMNS),
								rowHeight: HANGMAN_GRID_ROW_HEIGHT,
								select: 'single',
								gap: 'sm',
								cells: [...HANGMAN_ALPHABET].map((letter, index) => ({
									row: Math.floor(index / HANGMAN_GRID_COLUMNS),
									col: index % HANGMAN_GRID_COLUMNS,
									content: letter,
									color: (
										usedLetters.find(({ label }) => label === letter)?.hit ?
											SnapPaletteColors.Green
										: state.guesses.includes(letter.toLowerCase()) ?
											SnapPaletteColors.Red
										:
											SnapPaletteColors.Gray
									),
								})),
							},
						},
					}
					: {}),
				'hangman-used': {
					type: 'text',
					props: {
						content: `Used: ${[...state.guesses.toUpperCase()].join(' ') || 'None yet'}`,
						size: SnapTextSizes.Sm,
						align: SnapAlignments.Center,
					},
				},
				...(misses.length ?
					{
						'hangman-misses': {
							type: 'text',
							props: {
								content: `Misses: ${misses.join(' ')}`,
								size: SnapTextSizes.Sm,
								align: SnapAlignments.Center,
							},
						},
					}
				: {}),
			},
		} satisfies SnapExtraElements
	} catch {
		return undefined
	}
}
