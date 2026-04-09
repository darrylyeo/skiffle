import { getDemoCastsByFid } from '../../../../api/farcaster-client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	parent,
	params: { farcasterUserId },
}) => {
	const data = await parent()

	const { casts } = await getDemoCastsByFid({
		fid: Number(farcasterUserId),
	})

	return {
		...data,
		casts,
	}
}
