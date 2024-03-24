import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	params,
	parent,
}) => {
	const parentData = await parent()

	return {
		frame: {
			buttons: [
				parentData.frame.buttons[0],
			]
		}
	}
}
