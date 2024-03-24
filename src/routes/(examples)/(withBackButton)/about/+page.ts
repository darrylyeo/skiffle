// Functions
import { isTruthy } from '$/lib/isTruthy'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	parent,
	url,
}) => {
	const parentData = await parent()

	const currentPage = Number(url.searchParams.get('page') ?? 0)
	const totalPages = 3

	return {
		currentPage,
		totalPages,

		frame: {
			buttons: [
				parentData.frame.buttons[0],
				currentPage > 0 && {
					label: '‹ Previous Page',
					action: 'post',
					targetUrl: `?page=${currentPage - 1}`,
				},
				currentPage < totalPages - 1 && {
					label: 'Next Page ›',
					action: 'post',
					targetUrl: `?page=${currentPage + 1}`,
				},
				currentPage === totalPages - 1 && {
					label: '⟲ Read again',
					action: 'post',
					targetUrl: `?page=0`,
				},
			].filter(isTruthy),
		}
	}
}
