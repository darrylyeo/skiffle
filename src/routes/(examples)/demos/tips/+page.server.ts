// Data
import { tipsPageView } from './tips-frame'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const {
		currentPage,
		totalPages,
		message,
		frame,
		snap,
	} = tipsPageView(url)

	return {
		tipIndex: currentPage,
		tipCount: totalPages,
		message,
		title: `SKIFFLE Tips · Slide ${currentPage + 1} of ${totalPages}`,
		frame,
		snap,
	}
}

const frameAction = async ({ url }: { url: URL }) => {
	const {
		frame,
		snap,
	} = tipsPageView(url)

	return {
		frame,
		snap,
	}
}

export const actions: Actions = {
	open: frameAction,
	paginate: frameAction,
}
