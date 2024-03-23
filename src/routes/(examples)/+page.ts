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
					label: 'Mint',
					action: 'mint',
					targetUrl: '/mint',
				},
				{
					label: 'Tx',
					action: 'tx',
					targetUrl: '/tx',
				},
			]
		}
	}
}
