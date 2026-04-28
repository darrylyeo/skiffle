import { getDemoCastsByFid } from '$/routes/(examples)/farcaster/api/farcaster-client'
import type { Actions, PageServerLoad } from './$types'

import { buildCastsSnapPage, CASTS_SNAP_PAGE_SIZE } from './casts-snap'

const getDemoCastsByFidOrEmpty = async (
	opts: Parameters<typeof getDemoCastsByFid>[0],
) => {
	try {
		return await getDemoCastsByFid(opts)
	} catch (err) {
		console.warn('getDemoCastsByFid failed', err)

		return { casts: [], nextCursor: undefined }
	}
}

export const load: PageServerLoad = async ({
	parent,
	url,
}) => {
	const p = await parent()
	const cursor = url.searchParams.get('cursor') ?? undefined
	const { casts, nextCursor } = await getDemoCastsByFidOrEmpty({
		fid: p.user.fid,
		limit: CASTS_SNAP_PAGE_SIZE,
		cursor,
	})
	const { snap, frame } = buildCastsSnapPage({
		user: p.user,
		casts,
		nextCursor,
		parentSnap: p.snap,
	})

	return {
		...p,
		casts,
		nextCursor,
		snap,
		frame,
	}
}

export const actions = {
	paginate: async ({
		url,
		parent,
	}) => {
		const p = await parent()
		const cursor = url.searchParams.get('cursor') ?? undefined
		const { casts, nextCursor } = await getDemoCastsByFidOrEmpty({
			fid: p.user.fid,
			limit: CASTS_SNAP_PAGE_SIZE,
			cursor,
		})
		const { snap, frame } = buildCastsSnapPage({
			user: p.user,
			casts,
			nextCursor,
			parentSnap: p.snap,
		})

		return {
			casts,
			nextCursor,
			snap,
			frame,
		}
	},
} satisfies Actions
