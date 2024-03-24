import type { FrameMeta } from '$/lib/frame'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	data,
}) => {
	return {
		...data,
		frame: {
			image: {
				aspectRatio: '1:1',
			},
		} as FrameMeta
	}
}
