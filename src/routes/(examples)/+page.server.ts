// Types
import { type FrameMeta } from '$/lib/frame'
import { resolveRoute } from '$app/paths'


// Actions
import type { Actions } from './$types'

export const actions: Actions = {
	demos: async ({
		locals: { frameSignaturePacket },
	}) => {
		const farcasterUserId = frameSignaturePacket?.untrustedData.fid ?? 3

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
						targetUrl: resolveRoute(`/farcaster/user/[farcasterUserId]`, { farcasterUserId: String(farcasterUserId) }),
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
