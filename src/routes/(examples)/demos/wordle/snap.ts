// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'
import { SnapAlignments, SnapDirections, SnapElementTypes, SnapGaps, SnapJustifyValues, SnapPaletteColors, SnapTextSizes } from '$/lib/snap-spec'

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
				color: SnapPaletteColors.Green,
				letters: usedLetters.filter(({ state }) => state === 'correct'),
			},
			{
				id: 'wordle-used-present',
				label: 'Present',
				color: SnapPaletteColors.Amber,
				letters: usedLetters.filter(({ state }) => state === 'present'),
			},
			{
				id: 'wordle-used-miss',
				label: 'Miss',
				color: SnapPaletteColors.Red,
				letters: usedLetters.filter(({ state }) => state === 'miss'),
			},
		].filter(({ letters }) => letters.length > 0)
		const badgeRows = (letters: typeof usedLetters) => (
			Array.from(
				{
					length: Math.ceil(letters.length / 6),
				},
				(_, index) => letters.slice(index * 6, index * 6 + 6),
			)
		)

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
									type: SnapElementTypes.Stack,
									props: {
										gap: SnapGaps.Sm,
									},
									children: [
										`${id}-label`,
										`${id}-badges`,
									],
								},
							],
							[
								`${id}-label`,
								{
									type: SnapElementTypes.Text,
									props: {
										content: label,
										size: SnapTextSizes.Sm,
										align: SnapAlignments.Center,
										color,
									},
								},
							],
							[
								`${id}-badges`,
								{
									type: SnapElementTypes.Stack,
									props: {
										gap: SnapGaps.Sm,
									},
									children: badgeRows(letters).map((_, rowIndex) => `${id}-badges-row-${rowIndex}`),
								},
							],
							...badgeRows(letters).map((row, rowIndex) => (
								[
									`${id}-badges-row-${rowIndex}`,
									{
										type: SnapElementTypes.Stack,
										props: {
											direction: SnapDirections.Horizontal,
											gap: SnapGaps.Sm,
											justify: SnapJustifyValues.Center,
										},
										children: row.map(({ id: letterId }) => `${id}-badge-${letterId}`),
									},
								] as const
							)),
							...letters.map(({ id: letterId, letter }) => (
								[
									`${id}-badge-${letterId}`,
									{
										type: SnapElementTypes.Badge,
										props: {
											label: letter,
											color,
										},
									},
								] as const
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
