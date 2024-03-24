import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
	return {
		frame: {
			buttons: [
				{
					label: 'About',
					action: 'post',
					targetUrl: '/about',
				},
				{
					label: 'Demos...',
					action: 'post',
					targetUrl: '?/demos',
				},
			]
		}
	}
}
