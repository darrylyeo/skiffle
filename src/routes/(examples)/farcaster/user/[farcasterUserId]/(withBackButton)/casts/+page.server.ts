import { getDemoCastsByFid } from '../../../../api/farcaster-client'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({
	parent,
	params: { farcasterUserId },
	locals: { rasterPreview },
}) => {
	const data = await parent()

	const { casts } = await getDemoCastsByFid({
		fid: Number(farcasterUserId),
		/**
		 * Fewer casts for `?image=` (see `locals.rasterPreview` in `hooks.server.ts`).
		 * A taller stack under the profile hero can make resvg panic on some SVG output from Satori.
		 */
		limit: rasterPreview ? 6 : 25,
	})

	return {
		...data,
		casts,
	}
}
