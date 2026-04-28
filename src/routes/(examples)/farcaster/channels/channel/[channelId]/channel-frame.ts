// Types/constants
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { DemoFarcasterCast } from '$/lib/farcaster-casts'
import { farcasterCastContent } from '$/lib/farcaster-casts'
import type { AppSnapPage } from '$/lib/snap-components'
import type { SnapExtraElements } from '$/lib/snap-page-extra'
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import {
	SnapActions,
	SnapButtonVariants,
	SnapDirections,
	SnapElementTypes,
	SnapEvents,
	SnapGaps,
	SnapJustifyValues,
	SnapPaletteColors,
} from '$/lib/snap-spec'

import type { DemoChannel } from '$/routes/(examples)/farcaster/api/farcaster-client'

export const CHANNEL_CASTS_WEB_STEP = 3
export const CHANNEL_CASTS_FRAME_STEP = 3
const CHANNEL_CASTS_SNAP_PAGE_SIZE = 3
const CHANNEL_CASTS_SNAP_ITEM_TITLE_MAX = 30

const normalizedVisibleCount = (
	count: number,
	step: number,
	totalCount: number,
) => (
	totalCount === 0
		? 0
		: Number.isFinite(count)
			? Math.min(totalCount, Math.max(step, Math.trunc(count)))
			: Math.min(step, totalCount)
)

const channelRoute = (channelId: string) => (
	`/farcaster/channels/channel/${encodeURIComponent(channelId)}`
)

export const channelPagination = (
	casts: DemoFarcasterCast[],
	url: URL,
) => {
	const visibleCount = normalizedVisibleCount(Number(url.searchParams.get('count') ?? CHANNEL_CASTS_WEB_STEP), CHANNEL_CASTS_WEB_STEP, casts.length)
	const frameVisibleCount = normalizedVisibleCount(Number(url.searchParams.get('page') ?? CHANNEL_CASTS_FRAME_STEP), CHANNEL_CASTS_FRAME_STEP, casts.length)
	const framePageStart = Math.max(0, frameVisibleCount - CHANNEL_CASTS_FRAME_STEP)

	return {
		displayCasts: casts.slice(0, visibleCount),
		frameCasts: casts.slice(framePageStart, frameVisibleCount),
		frameVisibleCount,
		hasMoreCasts: visibleCount < casts.length,
		hasMoreFrameCasts: frameVisibleCount < casts.length,
		visibleCount,
	}
}

const frameMetaFromPaginationState = (
	channel: DemoChannel,
	{
		frameCasts,
		frameVisibleCount,
		hasMoreFrameCasts,
	}: ReturnType<typeof channelPagination>,
): FrameMeta => ({
	image: {
		url: `${channelRoute(channel.id)}?${new URLSearchParams({
			page: String(frameVisibleCount || CHANNEL_CASTS_FRAME_STEP),
			image: '',
		})}`,
		aspectRatio: '1:1',
	},
	buttons: [
		{
			label: '‹ Channels',
			action: 'post',
			targetUrl: '/farcaster/channels',
		},
		{
			label: 'Visit',
			action: 'link',
			targetUrl: channel.url,
		},
		frameCasts.length > 0 && hasMoreFrameCasts
			? {
				label: 'More Casts ›',
				action: 'post',
				targetUrl: `${channelRoute(channel.id)}?/paginate&page=${frameVisibleCount + CHANNEL_CASTS_FRAME_STEP}`,
			}
			: frameCasts.length > 0 && frameVisibleCount > CHANNEL_CASTS_FRAME_STEP
				? {
					label: 'Back to Top ›',
					action: 'post',
					targetUrl: `${channelRoute(channel.id)}?/paginate&page=${CHANNEL_CASTS_FRAME_STEP}`,
				}
				: undefined,
	]
		.filter(isTruthy)
		.slice(0, 4),
})

const snapFromPaginationState = (
	channel: DemoChannel,
	{
		frameCasts,
		frameVisibleCount,
		hasMoreFrameCasts,
	}: ReturnType<typeof channelPagination>,
): AppSnapPage => {
	const castItemIds: string[] = []
	const extraElements: SnapExtraElements['elements'] = {}

	for (const cast of frameCasts.slice(0, CHANNEL_CASTS_SNAP_PAGE_SIZE)) {
		const safeHash = cast.hash.replace(/^0x/i, '').slice(0, 20)
		const itemId = `channel-cast-item-${safeHash}`
		const buttonId = `channel-cast-open-${safeHash}`
		castItemIds.push(itemId)

		const castText = farcasterCastContent(cast.content)
		const title = (
			castText ?
				(
					castText.length > CHANNEL_CASTS_SNAP_ITEM_TITLE_MAX ?
						`${castText.slice(0, CHANNEL_CASTS_SNAP_ITEM_TITLE_MAX)}…`
					:
						castText
				)
			:
				'Cast'
		)
		const description = farcasterCastContent(
			`@${cast.authorUsername} · ${cast.reactionCount} reactions · ${cast.replyCount} replies`,
			160,
		)

		extraElements[itemId] = {
			type: SnapElementTypes.Item,
			props: {
				title,
				description,
			},
			children: [buttonId],
		}
		extraElements[buttonId] = {
			type: SnapElementTypes.Button,
			props: {
				label: 'View',
				variant: SnapButtonVariants.Secondary,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.OpenUrl,
					params: { target: cast.url },
				},
			},
		}
	}

	if (castItemIds.length > 0) {
		extraElements['channel-cast-item-group'] = {
			type: SnapElementTypes.ItemGroup,
			props: {
				separator: true,
				border: true,
				gap: SnapGaps.Sm,
			},
			children: castItemIds,
		}
	}

	return {
		castIntent: {
			text: `Browsing recent casts in /${channel.key} on the SKIFFLE demo snapsite 📡`,
		},
		theme: {
			accent: SnapPaletteColors.Purple,
		},
		buttons: [
			snapButtonGroup({
				direction: SnapDirections.Horizontal,
				gap: SnapGaps.Sm,
				justify: SnapJustifyValues.Center,
				children: [
					snapTargetButton({
						label: '‹ Channels',
						role: AppSnapButtonRoles.Back,
						action: 'post',
						targetUrl: '/farcaster/channels',
					}),
					snapTargetButton({
						label: 'Visit',
						role: AppSnapButtonRoles.External,
						variant: SnapButtonVariants.Secondary,
						action: 'link',
						targetUrl: channel.url,
					}),
					...(frameCasts.length > 0 && hasMoreFrameCasts
						? [
							snapTargetButton({
								label: 'More ›',
								role: AppSnapButtonRoles.Pager,
								action: 'post',
								targetUrl: `${channelRoute(channel.id)}?/paginate&page=${frameVisibleCount + CHANNEL_CASTS_FRAME_STEP}`,
							}),
						]
					: frameCasts.length > 0 && frameVisibleCount > CHANNEL_CASTS_FRAME_STEP
						? [
							snapTargetButton({
								label: 'Back to Top ›',
								role: AppSnapButtonRoles.Pager,
								action: 'post',
								targetUrl: `${channelRoute(channel.id)}?/paginate&page=${CHANNEL_CASTS_FRAME_STEP}`,
							}),
						]
					: []),
				].filter(isTruthy),
			}),
		],
		...(castItemIds.length > 0
			? {
				extraElements: {
					children: ['channel-cast-item-group'],
					elements: extraElements,
				},
			}
			: {}),
	}
}

export const channelPageView = (
	channel: DemoChannel,
	casts: DemoFarcasterCast[],
	url: URL,
) => {
	const state = channelPagination(casts, url)

	return {
		displayCasts: state.displayCasts,
		frame: frameMetaFromPaginationState(channel, state),
		hasMoreCasts: state.hasMoreCasts,
		snap: snapFromPaginationState(channel, state),
		visibleCount: state.visibleCount,
	}
}

export const buildChannelFrame = (
	channel: DemoChannel,
	casts: DemoFarcasterCast[],
	url: URL,
): FrameMeta => (
	channelPageView(channel, casts, url).frame
)

export const buildChannelSnap = (
	channel: DemoChannel,
	casts: DemoFarcasterCast[],
	url: URL,
): AppSnapPage => (
	channelPageView(channel, casts, url).snap
)
