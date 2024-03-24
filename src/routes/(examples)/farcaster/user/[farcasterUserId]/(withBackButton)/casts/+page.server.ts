// Functions
import { getCasts } from '../../../../api/pinata/farcaster'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	parent,
	params: { farcasterUserId },
}) => {
	const data = await parent()

	const { data: { casts } } = await getCasts({
		fid: Number(farcasterUserId),
	})

	return {
		...data,
		casts,
	}
}
