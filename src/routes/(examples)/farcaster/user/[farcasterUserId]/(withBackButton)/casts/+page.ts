// Types
import type { PageLoad } from './$types'
import type { FrameMeta } from '$/lib/frame'


// Data
export const load: PageLoad = async ({
	parent,
	data,
}) => {
	const parentData = await parent()

	return {
		...data,

		frame: {
			image: {
				aspectRatio: '1:1',
			},
			buttons: [
				parentData.frame.buttons[0],
			],
		} as FrameMeta,
	}
}
