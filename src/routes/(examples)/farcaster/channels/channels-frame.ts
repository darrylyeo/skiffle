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

export const CHANNELS_WEB_STEP = 8

const normalizedPage = (
	page: number,
	totalPages: number,
) => (
	Number.isFinite(page)
		? Math.min(Math.max(0, Math.trunc(page)), totalPages - 1)
		: 0
)

const normalizedVisibleCount = (
	count: number,
	totalCount: number,
) => (
	totalCount === 0
		? 0
		: Number.isFinite(count)
			? Math.min(
				totalCount,
				Math.max(CHANNELS_WEB_STEP, Math.trunc(count)),
			)
			: Math.min(CHANNELS_WEB_STEP, totalCount)
)

const channelDetailUrl = (channelId: string) => (
	`/farcaster/channels/channel/${encodeURIComponent(channelId)}`
)

export const channelsPagination = (
	channels: DemoChannel[],
	url: URL,
) => {
	const totalPages = Math.max(1, Math.ceil(channels.length / CHANNELS_PAGE_SIZE))
	const currentPage = normalizedPage(Number(url.searchParams.get('page') ?? 0), totalPages)
	const offset = currentPage * CHANNELS_PAGE_SIZE
	const shownForPage = channels.slice(
		offset,
		offset + CHANNELS_PAGE_SIZE,
	)

	const shownForFrame = shownForPage.slice(0, CHANNELS_FRAME_PAGE_SIZE)
	const visibleCount = normalizedVisibleCount(Number(url.searchParams.get('count') ?? CHANNELS_WEB_STEP), channels.length - offset)
	const displayChannels = channels.slice(
		offset,
		offset + visibleCount,
	)

	return {
		currentPage,
		displayChannels,
		hasMoreChannels: offset + visibleCount < channels.length,
		totalPages,
		visibleCount,
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
					action: 'post' as const,
					targetUrl: `${channelDetailUrl(channel.id)}?/open`,
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
	castIntent: {
		text: 'Browsing popular Farcaster channels in the SKIFFLE demo.',
	},
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
				role: AppSnapButtonRoles.Cta,
				variant: SnapButtonVariants.Primary,
				action: 'post',
				targetUrl: `${channelDetailUrl(channel.id)}?/open`,
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
						role: AppSnapButtonRoles.Cta,
						variant: SnapButtonVariants.Primary,
						action: 'post',
						targetUrl: `${channelDetailUrl(channel.id)}?/open`,
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
		currentPage: state.currentPage,
		displayChannels: state.displayChannels,
		frame: frameMetaFromPaginationState(state),
		hasMoreChannels: state.hasMoreChannels,
		snap: snapFromPaginationState(state),
		visibleCount: state.visibleCount,
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
