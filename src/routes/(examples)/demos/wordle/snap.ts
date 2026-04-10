// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'
import { SnapAlignments, SnapGaps, SnapTextSizes } from '$/lib/snap-spec'

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
				id: 'wordle-used-correct',
				label: 'Correct',
				color: 'green',
				letters: usedLetters.filter(({ state }) => state === 'correct'),
			},
			{
				id: 'wordle-used-present',
				label: 'Present',
				color: 'amber',
				letters: usedLetters.filter(({ state }) => state === 'present'),
			},
			{
				id: 'wordle-used-miss',
				label: 'Miss',
				color: 'red',
				letters: usedLetters.filter(({ state }) => state === 'miss'),
			},
		].filter(({ letters }) => letters.length > 0)

		return {
			children: [
				'wordle-used-separator',
				'wordle-used-stack',
			],
			elements: {
				'wordle-used-separator': {
					type: 'separator',
					props: {},
				},
				'wordle-used-stack': {
					type: 'stack',
					props: {
						gap: SnapGaps.Sm,
					},
					children: groups.map(({ id }) => id),
				},
				...Object.fromEntries(
					groups.flatMap(({ id, label, color, letters }) => (
						[
							[
								id,
								{
									type: 'text',
									props: {
										content: `${label}: ${letters.map(({ letter }) => letter).join(' ')}`,
										size: SnapTextSizes.Sm,
										align: SnapAlignments.Center,
										...(color ? { color } : {}),
									},
								},
							],
						] as const
					)),
				),
			},
		} satisfies SnapExtraElements
	} catch {
		return undefined
	}
}
