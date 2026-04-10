// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'

import { parseWordleState, wordleUsedLetters } from './wordle-frame'

const chunk = <Type,>(
	values: Type[],
	size: number,
) => (
	Array.from(
		{ length: Math.ceil(values.length / size) },
		(_, index) => values.slice(index * size, (index + 1) * size),
	)
)

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
					groups.flatMap(({ id, label, color, letters }) => (
						[
							[
								id,
								{
									type: 'stack',
									props: {
										gap: 'sm',
									},
									children: [
										`${id}-label`,
										...chunk(letters, 6).map((_, index) => `${id}-row-${index}`),
									],
								},
							],
							[
								`${id}-label`,
								{
									type: 'badge',
									props: {
										label: `${label} (${letters.length})`,
										color,
										variant: 'outline',
									},
								},
							],
							...chunk(letters, 6).flatMap((row, index) => (
								[
									[
										`${id}-row-${index}`,
										{
											type: 'stack',
											props: {
												direction: 'horizontal',
												gap: 'sm',
												justify: 'center',
											},
											children: row.map(({ id }) => `${id}-badge`),
										},
									],
									...row.map(({ id, letter }) => (
										[
											`${id}-badge`,
											{
												type: 'badge',
												props: {
													label: letter,
													color,
												},
											},
										]
									)),
								]
							)),
						] as const
					)),
				),
			},
		} satisfies SnapExtraElements
	} catch {
		return undefined
	}
}
