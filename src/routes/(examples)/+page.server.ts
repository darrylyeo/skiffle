// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { snapBackButton, snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { type FrameButton, type FrameMeta } from '$/lib/frame'
import { resolve } from '$app/paths'
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

		const demos = [
			{
				label: '👤 My Profile',
				action: 'post',
				targetUrl: resolve('/(examples)/farcaster/user/[farcasterUserId]', { farcasterUserId: String(farcasterUserId) }),
			},
			{
				label: '📻 Channels',
				action: 'post',
				targetUrl: '/farcaster/channels?/open',
			},
			{
				label: '🔢 Counter',
				action: 'post',
				targetUrl: '/demos/counter?/open',
			},
			{
				label: '🪙 Coin Flip',
				action: 'post',
				targetUrl: '/demos/coin-flip?/open',
			},
			{
				label: '🎨 Generative Art',
				action: 'post',
				targetUrl: '/demos/abstract-art?/open',
			},
			{
				label: '✂️ Rock Paper Scissors',
				action: 'post',
				targetUrl: '/demos/rock-paper-scissors?/open',
			},
			{
				label: '❎ Tic-tac-toe',
				action: 'post',
				targetUrl: '/demos/tic-tac-toe?/open',
			},
			{
				label: '🔠 Hangman',
				action: 'post',
				targetUrl: '/demos/hangman?/open',
			},
			{
				label: '🟩 Wordle',
				action: 'post',
				targetUrl: '/demos/wordle?/open',
			},
			{
				label: '📽️ Slideshow',
				action: 'post',
				targetUrl: '/demos/tips?/open',
			},
		] satisfies FrameButton[]

		const snapItemsPerPage = 4
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
					aspectRatio: '1.91:1',
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
	}
}
