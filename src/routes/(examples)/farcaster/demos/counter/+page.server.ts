// Functions
import { clampCount, counterFrameMeta } from './counter-frame'


// Data
import type { Actions, PageServerLoad } from './$types'

const countFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return clampCount(Number(new URL(href).searchParams.get('count') ?? 0))
	} catch {
		return undefined
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const raw = url.searchParams.get('count')
	const count = raw === null || raw === ''
		? 0
		: clampCount(Number(raw))
	return { count }
}

export const actions: Actions = {
	open: async () => ({ frame: counterFrameMeta(0) }),
	bump: async ({ locals, url }) => {
		const count = (
			countFromHref(locals.frameSignaturePacket?.untrustedData.url)
			?? clampCount(Number(url.searchParams.get('count') ?? 0))
		)
		const delta = Number(url.searchParams.get('delta') ?? 0)
		return {
			frame: counterFrameMeta(clampCount(
				count + (Number.isFinite(delta) ? delta : 0),
			)),
		}
	},
	set: async ({ url }) => ({
		frame: counterFrameMeta(clampCount(Number(url.searchParams.get('to') ?? 0))),
	}),
}
