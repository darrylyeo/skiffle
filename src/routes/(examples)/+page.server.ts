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

		const currentPage = Number(url.searchParams.get('page') ?? 0)

		const demos = [
			{
				label: 'My Profile',
				action: 'post',
				targetUrl: resolve('/(examples)/farcaster/user/[farcasterUserId]', { farcasterUserId: String(farcasterUserId) }),
			},
			{
				label: 'Channels',
				action: 'post',
				targetUrl: '/farcaster/channels?/open',
			},
			{
				label: 'Counter',
				action: 'post',
				targetUrl: '/demos/counter?/open',
			},
			{
				label: 'Coin Flip',
				action: 'post',
				targetUrl: '/demos/coin-flip?/open',
			},
			{
				label: 'Abstract Art',
				action: 'post',
				targetUrl: '/demos/abstract-art?/open',
			},
			{
				label: 'Rock Paper Scissors',
				action: 'post',
				targetUrl: '/demos/rock-paper-scissors?/open',
			},
			{
				label: 'Tic-tac-toe',
				action: 'post',
				targetUrl: '/demos/tic-tac-toe?/open',
			},
			{
				label: 'Hangman',
				action: 'post',
				targetUrl: '/demos/hangman?/open',
			},
			{
				label: 'Wordle',
				action: 'post',
				targetUrl: '/demos/wordle?/open',
			},
			{
				label: 'Tips',
				action: 'post',
				targetUrl: '/demos/tips?/open',
			},
		] satisfies FrameButton[]

		const itemsPerPage = 2
		const totalPages = Math.ceil(demos.length / itemsPerPage)
		const pageDemos = demos.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
		
		return {
			snap: {
				shareText: 'Browsing the routes in the SKIFFLE demo and how the project maps them into Farcaster interactions.',
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
							...pageDemos.map((demo) => snapTargetButton({
								label: demo.label,
								role: AppSnapButtonRoles.Cta,
								variant: SnapButtonVariants.Primary,
								action: demo.action,
								targetUrl: demo.targetUrl,
							})),
						],
					}),
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
					...pageDemos,
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
