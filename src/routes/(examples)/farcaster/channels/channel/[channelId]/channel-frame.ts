// Types/constants
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { DemoFarcasterCast } from '$/lib/farcaster-casts'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

import type { DemoChannel } from '../../../api/farcaster-client'

export const CHANNEL_CASTS_WEB_STEP = 5
export const CHANNEL_CASTS_FRAME_STEP = 3

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

	return {
		displayCasts: casts.slice(0, visibleCount),
		frameCasts: casts.slice(0, frameVisibleCount),
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
			targetUrl: '/farcaster/channels?/open',
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
): AppSnapPage => ({
	castIntent: {
		text: `Browsing recent casts in /${channel.key} in the SKIFFLE Farcaster demo.`,
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
					targetUrl: '/farcaster/channels?/open',
				}),
				snapTargetButton({
					label: 'Visit',
					role: AppSnapButtonRoles.External,
					variant: SnapButtonVariants.Secondary,
					action: 'link',
					targetUrl: channel.url,
				}),
			].filter(isTruthy),
		}),
		...(
			frameCasts.length > 0 ?
				[
					snapButtonGroup({
						direction: SnapDirections.Horizontal,
						gap: SnapGaps.Sm,
						justify: SnapJustifyValues.Center,
						children: frameCasts.map((cast) => (
							snapTargetButton({
								label: `@${cast.authorUsername}`,
								role: AppSnapButtonRoles.External,
								variant: SnapButtonVariants.Primary,
								action: 'link',
								targetUrl: cast.url,
							})
						)),
					}),
				]
			:
				[]
		),
		...(
			frameCasts.length > 0 && hasMoreFrameCasts ?
				[
					snapButtonGroup({
						direction: SnapDirections.Horizontal,
						gap: SnapGaps.Sm,
						justify: SnapJustifyValues.Center,
						children: [
							snapTargetButton({
								label: 'More Casts ›',
								role: AppSnapButtonRoles.Pager,
								action: 'post',
								targetUrl: `${channelRoute(channel.id)}?/paginate&page=${frameVisibleCount + CHANNEL_CASTS_FRAME_STEP}`,
							}),
						],
					}),
				]
			: frameCasts.length > 0 && frameVisibleCount > CHANNEL_CASTS_FRAME_STEP ?
				[
					snapButtonGroup({
						direction: SnapDirections.Horizontal,
						gap: SnapGaps.Sm,
						justify: SnapJustifyValues.Center,
						children: [
							snapTargetButton({
								label: 'Back to Top ›',
								role: AppSnapButtonRoles.Pager,
								action: 'post',
								targetUrl: `${channelRoute(channel.id)}?/paginate&page=${CHANNEL_CASTS_FRAME_STEP}`,
							}),
						],
					}),
				]
			:
				[]
		),
	],
})

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
