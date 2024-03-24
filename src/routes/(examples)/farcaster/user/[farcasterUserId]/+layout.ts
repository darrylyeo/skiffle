import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({
	data,
}) => {
	return {
		...data,

		frame: {
			buttons: [
				{
					label: '‹ Back',
					action: 'post',
					targetUrl: '/',
				},
			]
		}
	}
}
