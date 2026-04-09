// Types
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'

import type { DemoChannel } from '../api/farcaster-client'

/** Link buttons per frame page (Snap / frame pagination). */
export const CHANNELS_FRAME_PAGE_SIZE = 2

/** Max channel cards rendered on the HTML page for the current `page` query. */
export const CHANNELS_LIST_MAX = 8

export const channelsPagination = (
	channels: DemoChannel[],
	url: URL,
) => {
	const currentPage = Number(url.searchParams.get('page') ?? 0)
	const offset = currentPage * CHANNELS_FRAME_PAGE_SIZE
	const totalPages = Math.max(1, Math.ceil(channels.length / CHANNELS_FRAME_PAGE_SIZE))

	const shownForFrame = channels.slice(
		offset,
		offset + CHANNELS_FRAME_PAGE_SIZE,
	)

	const displayChannels = channels.slice(
		offset,
		offset + CHANNELS_LIST_MAX,
	)

	return {
		currentPage,
		totalPages,
		displayChannels,
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
			aspectRatio: '1:1',
		},
		buttons: [
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
		].filter(isTruthy),
	}
)

export const channelsPageView = (
	channels: DemoChannel[],
	url: URL,
) => {
	const state = channelsPagination(channels, url)
	return {
		displayChannels: state.displayChannels,
		frame: frameMetaFromPaginationState(state),
	}
}

export const buildChannelsFrame = (
	channels: DemoChannel[],
	url: URL,
): FrameMeta => (
	channelsPageView(channels, url).frame
)
