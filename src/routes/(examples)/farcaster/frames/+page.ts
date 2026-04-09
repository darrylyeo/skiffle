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
	const totalPages = Math.ceil(data.topFrames.length / itemsPerPage)

	const shownFrames = data.topFrames.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

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
					targetUrl: '/farcaster',
				},
				...shownFrames.map((frame) => ({
					label: new URL(frame.url).host,
					action: 'link',
					targetUrl: frame.warpcast_urls[0],
				})),
				currentPage < totalPages - 1
					? {
						label: 'More Frames ›',
						action: 'post',
						targetUrl: `?page=${currentPage + 1}`,
					}
					: {
						label: 'Back to Top ›',
						action: 'post',
						targetUrl: `?page=${0}`,
					},
			].filter(isTruthy),
		} as FrameMeta
	}
}
