// Types
import { type FrameMeta, type FrameSignaturePacket } from '$/lib/frame'


// Actions
import type { Actions } from './$types'

export const actions: Actions = {
	demos: async ({
		request,
	}) => {
		const frameSignaturePacket = await request.json() as FrameSignaturePacket

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
					{
						label: 'Farcaster Users',
						action: 'post',
						targetUrl: '/farcaster/user/3',
					},
					{
						label: 'Top Frames',
						action: 'post',
						targetUrl: '/farcaster/frames',
					},
				],
			} as FrameMeta,
		}
	}
}
