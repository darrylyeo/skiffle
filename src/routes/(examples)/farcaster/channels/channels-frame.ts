// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

import type { DemoChannel } from '../api/farcaster-client'

/** Channels paged together for HTML/Snap state. */
export const CHANNELS_PAGE_SIZE = 4

/** Link buttons per frame page, limited by frame button constraints. */
export const CHANNELS_FRAME_PAGE_SIZE = 2

/** Max channel cards rendered on the HTML page for the current `page` query. */
export const CHANNELS_LIST_MAX = 8

export const channelsPagination = (
	channels: DemoChannel[],
	url: URL,
) => {
	const currentPage = Number(url.searchParams.get('page') ?? 0)
	const offset = currentPage * CHANNELS_PAGE_SIZE
	const totalPages = Math.max(1, Math.ceil(channels.length / CHANNELS_PAGE_SIZE))
	const shownForPage = channels.slice(
		offset,
		offset + CHANNELS_PAGE_SIZE,
	)

	const shownForFrame = shownForPage.slice(0, CHANNELS_FRAME_PAGE_SIZE)

	const displayChannels = channels.slice(
		offset,
		offset + CHANNELS_LIST_MAX,
	)

	return {
		currentPage,
		totalPages,
		displayChannels,
		shownForPage,
		shownForFrame,
	}
}

const frameMetaFromPaginationState = ({
	currentPage,
	totalPages,
	shownForFrame,
}: ReturnType<typeof channelsPagination>): FrameMeta => (
	{
		image: {
			url: `/farcaster/channels?${new URLSearchParams({
				page: String(currentPage),
				frameImage: '',
			})}`,
			aspectRatio: '1:1',
		},
		buttons: (
			[
				{
					label: '‹ Back',
					action: 'post',
					targetUrl: '/?/demos',
				},
				...shownForFrame.map((channel) => ({
					label: channel.name.slice(0, 32),
					action: 'link' as const,
					targetUrl: channel.url,
				})),
				currentPage < totalPages - 1
					? {
						label: 'More ›',
						action: 'post',
						targetUrl: `/farcaster/channels?/paginate&page=${currentPage + 1}`,
					}
					: {
						label: 'Back to Top ›',
						action: 'post',
						targetUrl: '/farcaster/channels?/paginate&page=0',
					},
			] as const
		)
			.filter(isTruthy)
			.slice(0, 4) as FrameMeta['buttons'],
	}
)

const snapFromPaginationState = ({
	currentPage,
	totalPages,
	shownForPage,
}: ReturnType<typeof channelsPagination>): AppSnapPage => ({
	shareText: 'Browsing popular Farcaster channels in the SKIFFLE demo.',
	theme: {
		accent: SnapPaletteColors.Blue,
	},
	buttons: [
		snapButtonGroup({
			direction: SnapDirections.Horizontal,
			gap: SnapGaps.Sm,
			justify: SnapJustifyValues.Center,
			children: [
				snapTargetButton({
					label: '‹ Back',
					role: AppSnapButtonRoles.Back,
					action: 'post',
					targetUrl: '/?/demos',
				}),
				currentPage < totalPages - 1
					? snapTargetButton({
						label: 'More ›',
						role: AppSnapButtonRoles.Pager,
						action: 'post',
						targetUrl: `/farcaster/channels?/paginate&page=${currentPage + 1}`,
					})
					: snapTargetButton({
						label: 'Back to Top ›',
						role: AppSnapButtonRoles.Pager,
						action: 'post',
						targetUrl: '/farcaster/channels?/paginate&page=0',
					}),
			],
		}),
		snapButtonGroup({
			direction: SnapDirections.Horizontal,
			gap: SnapGaps.Sm,
			justify: SnapJustifyValues.Center,
			children: shownForPage.slice(0, 2).map((channel) => snapTargetButton({
				label: channel.name.slice(0, 32),
				role: AppSnapButtonRoles.External,
				variant: SnapButtonVariants.Primary,
				action: 'link',
				targetUrl: channel.url,
			})),
		}),
		...(shownForPage.length > 2
			? [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: shownForPage.slice(2).map((channel) => snapTargetButton({
						label: channel.name.slice(0, 32),
						role: AppSnapButtonRoles.External,
						variant: SnapButtonVariants.Primary,
						action: 'link',
						targetUrl: channel.url,
					})),
				}),
			]
			: []),
	],
})

export const channelsPageView = (
	channels: DemoChannel[],
	url: URL,
) => {
	const state = channelsPagination(channels, url)
	return {
		displayChannels: state.displayChannels,
		frame: frameMetaFromPaginationState(state),
		snap: snapFromPaginationState(state),
	}
}

export const buildChannelsFrame = (
	channels: DemoChannel[],
	url: URL,
): FrameMeta => (
	channelsPageView(channels, url).frame
)

export const buildChannelsSnap = (
	channels: DemoChannel[],
	url: URL,
): AppSnapPage => (
	channelsPageView(channels, url).snap
)
