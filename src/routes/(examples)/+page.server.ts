// Types
import { type FrameMeta } from '$/lib/frame'
import { resolve } from '$app/paths'


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
				label: 'Mint',
				action: 'mint',
				targetUrl: 'eip155:7777777:0x55f5a5d980992e01256d86e7ef03a22fd5fe84af',
			},
			{
				label: 'Useless Tx',
				action: 'tx',
				targetUrl: '/tx',
			},
		]

		const itemsPerPage = 2
		const totalPages = Math.ceil(demos.length / itemsPerPage)
		
		return {
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
					...demos.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage),
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
