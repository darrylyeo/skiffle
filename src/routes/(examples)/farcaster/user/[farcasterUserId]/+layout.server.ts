import { getDemoUserByFid } from '../../api/farcaster-client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
	params: { farcasterUserId },
}) => {
	const user = await getDemoUserByFid({
		fid: Number(farcasterUserId),
	})

	return {
		user,
	}
}
