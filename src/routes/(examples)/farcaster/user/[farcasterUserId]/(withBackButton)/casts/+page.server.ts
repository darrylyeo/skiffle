import { getDemoCastsByFid } from '$/routes/(examples)/farcaster/api/farcaster-client'
import type { Actions, PageServerLoad } from './$types'

import { buildCastsSnapPage } from './casts-snap'

export const load: PageServerLoad = async ({
	parent,
	url,
}) => {
	const p = await parent()
	const cursor = url.searchParams.get('cursor') ?? undefined
	const { casts, nextCursor } = await getDemoCastsByFid({
		fid: p.user.fid,
		limit: 6,
		cursor,
	})
	const { snap, frame } = buildCastsSnapPage({
		user: p.user,
		casts,
		nextCursor,
		parentSnap: p.snap,
		parentFrame: p.frame,
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
		const { casts, nextCursor } = await getDemoCastsByFid({
			fid: p.user.fid,
			limit: 6,
			cursor,
		})
		const { snap, frame } = buildCastsSnapPage({
			user: p.user,
			casts,
			nextCursor,
			parentSnap: p.snap,
			parentFrame: p.frame,
		})

		return {
			casts,
			nextCursor,
			snap,
			frame,
		}
	},
} satisfies Actions
