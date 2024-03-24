import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
	return {
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
