// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { snapBackButton, snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { type FrameMeta } from '$/lib/frame'
import { DEMOS_SNAP_PAGE_SIZE, demosFrameButtons } from '$/routes/(examples)/demos'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues } from '$/lib/snap-spec'


// Actions
import type { Actions } from './$types'

export const actions: Actions = {
	demos: async ({
		url,
		locals: { farcasterViewerFid },
	}) => {
		const farcasterUserId = farcasterViewerFid ?? 1

		const currentPage = Number.isFinite(Number(url.searchParams.get('page') ?? 0))
			? Math.max(0, Math.trunc(Number(url.searchParams.get('page') ?? 0)))
			: 0

		const demos = demosFrameButtons(farcasterUserId)

		const snapItemsPerPage = DEMOS_SNAP_PAGE_SIZE
		const frameItemsPerPage = 2
		const totalPages = Math.max(1, Math.ceil(demos.length / snapItemsPerPage))
		const pageDemos = demos.slice(
			currentPage * snapItemsPerPage,
			(currentPage + 1) * snapItemsPerPage,
		)
		const framePageDemos = pageDemos.slice(0, frameItemsPerPage)

		return {
			snap: {
				castIntent: {
					text: 'Browsing the routes in the SKIFFLE demo and how the project maps them into Farcaster interactions.',
				},
				buttons: [
					snapButtonGroup({
						direction: SnapDirections.Horizontal,
						gap: SnapGaps.Sm,
						justify: SnapJustifyValues.Center,
						children: [
							snapBackButton('/'),
							snapTargetButton({
								label: 'More Demos ›',
								role: AppSnapButtonRoles.Pager,
								action: 'post',
								targetUrl: `?${new URLSearchParams({
									...Object.fromEntries(url.searchParams.entries()),
									page: String((currentPage + 1) % totalPages),
								})}`,
							}),
						],
					}),
					snapButtonGroup({
						direction: SnapDirections.Horizontal,
						gap: SnapGaps.Sm,
						justify: SnapJustifyValues.Center,
						children: [
							...pageDemos.slice(0, 2).map((demo) => snapTargetButton({
								label: demo.label,
								role: AppSnapButtonRoles.Cta,
								variant: SnapButtonVariants.Primary,
								action: demo.action,
								targetUrl: demo.targetUrl,
							})),
						],
					}),
					...(pageDemos.length > 2
						? [
							snapButtonGroup({
								direction: SnapDirections.Horizontal,
								gap: SnapGaps.Sm,
								justify: SnapJustifyValues.Center,
								children: pageDemos.slice(2).map((demo) => snapTargetButton({
									label: demo.label,
									role: AppSnapButtonRoles.Cta,
									variant: SnapButtonVariants.Primary,
									action: demo.action,
									targetUrl: demo.targetUrl,
								})),
							}),
						]
						: []),
				],
			},
			frame: {
				image: {
					url: '.',
					aspectRatio: '16:9',
				},
				buttons: [
					{
						label: '‹ Back',
						action: 'post',
						targetUrl: '/',
					},
					...framePageDemos,
					{
						label: 'More Demos ›',
						action: 'post',
						targetUrl: `?${new URLSearchParams({
							...Object.fromEntries(url.searchParams.entries()),
							page: String((currentPage + 1) % totalPages),
						})}`,
					},
				],
			} as FrameMeta,
		}
	},
}
