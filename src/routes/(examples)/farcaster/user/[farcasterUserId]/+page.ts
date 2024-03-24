// Tyoes
import type { FrameMeta } from '$/lib/frame'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	parent,
}) => {
	const parentData = await parent()

	return {
		...parentData,

		frame: {
			buttons: [
				parentData.frame.buttons[0],
			]
		} as FrameMeta,
	}
}
