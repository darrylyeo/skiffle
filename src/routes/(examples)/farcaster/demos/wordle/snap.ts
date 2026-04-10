// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'

import { parseWordleState, wordleUsedLetters } from './wordle-frame'

export const wordleSnapExtraElements = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)
		if (stateUrl.pathname !== '/farcaster/demos/wordle') {
			return undefined
		}

		const state = parseWordleState(stateUrl)
		const usedLetters = wordleUsedLetters(state)
		if (!usedLetters.length) {
			return undefined
		}
		const correct = usedLetters.filter(({ state }) => state === 'correct')
		const present = usedLetters.filter(({ state }) => state === 'present')
		const miss = usedLetters.filter(({ state }) => state === 'miss')
		const groups = [
			correct.length && {
				id: 'wordle-used-correct',
				content: `Green: ${correct.map(({ letter }) => letter).join(' ')}`,
			},
			present.length && {
				id: 'wordle-used-present',
				content: `Yellow: ${present.map(({ letter }) => letter).join(' ')}`,
			},
			miss.length && {
				id: 'wordle-used-miss',
				content: `Red: ${miss.map(({ letter }) => letter).join(' ')}`,
			},
		].filter((group): group is { id: string, content: string } => Boolean(group))

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
						gap: 'sm',
					},
					children: [
						'wordle-used-title',
						...groups.map(({ id }) => id),
					],
				},
				'wordle-used-title': {
					type: 'text',
					props: {
						content: 'Used letters',
						size: 'sm',
						align: 'center',
					},
				},
				...Object.fromEntries(
					groups.map(({ id, content }) => (
						[
							id,
							{
								type: 'text',
								props: {
									content,
									size: 'sm',
									align: 'center',
								},
							},
						]
					)),
				),
			},
		} satisfies SnapExtraElements
	} catch {
		return undefined
	}
}
