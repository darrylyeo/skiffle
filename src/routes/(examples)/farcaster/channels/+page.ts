// Types
import type { FrameMeta } from '$/lib/frame'


// Functions
import { isTruthy } from '$/lib/isTruthy'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	data,
	url,
}) => {
	const currentPage = Number(url.searchParams.get('page') ?? 0)
	const itemsPerPage = 2
	const totalPages = Math.max(1, Math.ceil(data.channels.length / itemsPerPage))

	const shownChannels = data.channels.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage,
	)

	return {
		...data,
		frame: {
			image: {
				aspectRatio: '1:1',
			},
			buttons: [
				{
					label: '‹ Back',
					action: 'post',
					targetUrl: '/?/demos',
				},
				...shownChannels.map((channel) => ({
					label: channel.name.slice(0, 32),
					action: 'link' as const,
					targetUrl: channel.url,
				})),
				currentPage < totalPages - 1
					? {
						label: 'More ›',
						action: 'post',
						targetUrl: `?page=${currentPage + 1}`,
					}
					: {
						label: 'Back to Top ›',
						action: 'post',
						targetUrl: `?page=${0}`,
					},
			].filter(isTruthy),
		} as FrameMeta,
	}
}
