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
					label: 'GitHub',
					action: 'link',
					targetUrl: 'https://github.com/darrylyeo/skiffle',
				},
				{
					label: 'Follow',
					action: 'link',
					targetUrl: 'https://warpcast.com/darrylyeo',
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
