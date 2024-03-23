import { getUserByFID } from '../../api/pinata/farcaster'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
	params: { farcasterUserId },
}) => {
	const { data: user } = await getUserByFID({
		fid: Number(farcasterUserId),
	})

	return {
		user,
	}
}
