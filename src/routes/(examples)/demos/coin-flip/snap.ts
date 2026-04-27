// Types
import type { FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'

// Functions
import { frameStateUrlFromFrame } from '$/lib/snap-page-extra'
import {
	SnapAlignments,
	SnapDirections,
	SnapElementTypes,
	SnapGaps,
	SnapJustifyValues,
	SnapPaletteColors,
	SnapTextSizes,
} from '$/lib/snap-spec'

import { coinFlipHistoryBadges, parseCoinFlipState } from './coin-flip-frame'

const badgeColor = (result: 'heads' | 'tails' | 'edge') => (
	result === 'heads'
		? SnapPaletteColors.Amber
	: result === 'tails'
		? SnapPaletteColors.Blue
	:
		SnapPaletteColors.Pink
)

export const coinFlipSnapExtraElements = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => {
	try {
		const stateUrl = frameStateUrlFromFrame(frame, baseUrl)
		if (stateUrl.pathname !== '/demos/coin-flip') {
			return undefined
		}

		const badges = coinFlipHistoryBadges(parseCoinFlipState(stateUrl))
		if (!badges.length) {
			return undefined
		}

		const rows = badges.reduce<typeof badges[]>((groups, badge, index) => {
			const row = Math.floor(index / 8)

			return [
				...groups.slice(0, row),
				[
					...(groups[row] ?? []),
					badge,
				],
				...groups.slice(row + 1),
			]
		}, [])

		return {
			children: ['coin-history-extra'],
			elements: {
				'coin-history-extra': {
					type: SnapElementTypes.Stack,
					props: {
						direction: SnapDirections.Vertical,
						gap: SnapGaps.Sm,
					},
					children: [
						'coin-history-separator',
						'coin-history-label',
						...rows.map((_, index) => `coin-history-row-${index}`),
					],
				},
				'coin-history-separator': {
					type: SnapElementTypes.Separator,
					props: {},
				},
				'coin-history-label': {
					type: SnapElementTypes.Text,
					props: {
						content: 'Last 16 flips',
						size: SnapTextSizes.Sm,
						align: SnapAlignments.Center,
					},
				},
				...Object.fromEntries(
					rows.flatMap((badges, rowIndex) => (
						[
							[
								`coin-history-row-${rowIndex}`,
								{
									type: SnapElementTypes.Stack,
									props: {
										direction: SnapDirections.Horizontal,
										gap: SnapGaps.Sm,
										justify: SnapJustifyValues.Center,
									},
									children: badges.map(({ id }) => `coin-history-badge-${id}`),
								},
							],
							...badges.map((badge) => (
								[
									`coin-history-badge-${badge.id}`,
									{
										type: SnapElementTypes.Badge,
										props: {
											label: badge.short,
											color: badgeColor(badge.result),
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
