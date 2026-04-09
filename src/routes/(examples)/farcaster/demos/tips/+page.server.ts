// Functions
import { tipsPageView, buildTipsFrame } from './tips-frame'


// Data
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const {
		currentPage,
		totalPages,
		message,
		frame,
	} = tipsPageView(url)

	return {
		tipIndex: currentPage,
		tipCount: totalPages,
		message,
		frame,
	}
}

const frameAction = async ({ url }: { url: URL }) => ({
	frame: buildTipsFrame(url),
})

export const actions: Actions = {
	open: frameAction,
	paginate: frameAction,
}
