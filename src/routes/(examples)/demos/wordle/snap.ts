// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'
import { SnapAlignments, SnapElementTypes, SnapGaps, SnapPaletteColors, SnapTextSizes } from '$/lib/snap-spec'

import { parseWordleState, wordleUsedLetters } from './wordle-frame'

export const wordleSnapExtraElements = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)
		if (stateUrl.pathname !== '/demos/wordle') {
			return undefined
		}

		const state = parseWordleState(stateUrl)
		const usedLetters = wordleUsedLetters(state)
		if (!usedLetters.length) {
			return undefined
		}
		const groups = [
			{
				label: 'Correct',
				letters: usedLetters.filter(({ state }) => state === 'correct'),
			},
			{
				label: 'Present',
				letters: usedLetters.filter(({ state }) => state === 'present'),
			},
			{
				label: 'Miss',
				letters: usedLetters.filter(({ state }) => state === 'miss'),
			},
		].filter(({ letters }) => letters.length > 0)

		const summary = (
			groups
				.map(({ label, letters }) => (
					`${label}: ${letters.map((l) => l.letter).join(' · ')}`
				))
				.join('\n')
		)

		return {
			children: [
				'wordle-used-panel',
			],
			elements: {
				'wordle-used-panel': {
					type: SnapElementTypes.Stack,
					props: {
						gap: SnapGaps.Sm,
					},
					children: [
						'wordle-used-separator',
						'wordle-used-summary',
					],
				},
				'wordle-used-separator': {
					type: SnapElementTypes.Separator,
					props: {},
				},
				'wordle-used-summary': {
					type: SnapElementTypes.Text,
					props: {
						content: summary.slice(0, 400),
						size: SnapTextSizes.Sm,
						align: SnapAlignments.Center,
						color: SnapPaletteColors.Gray,
					},
				},
			},
		} satisfies SnapExtraElements
	} catch {
		return undefined
	}
}
