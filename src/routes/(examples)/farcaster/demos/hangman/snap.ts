// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'

import { hangmanMisses, parseHangmanState } from './hangman-frame'

export const hangmanSnapExtraElements = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)
		if (stateUrl.pathname !== '/farcaster/demos/hangman') {
			return undefined
		}

		const state = parseHangmanState(stateUrl)
		if (!state.guesses.length) {
			return undefined
		}

		const misses = hangmanMisses(state)

		return {
			children: [
				'hangman-used',
				...(misses.length ? ['hangman-misses'] : []),
			],
			elements: {
				'hangman-used': {
					type: 'text',
					props: {
						content: `Used: ${[...state.guesses.toUpperCase()].join(' ')}`,
						size: 'sm',
						align: 'center',
					},
				},
				...(misses.length ?
					{
						'hangman-misses': {
							type: 'text',
							props: {
								content: `Misses: ${misses.join(' ')}`,
								size: 'sm',
								align: 'center',
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
