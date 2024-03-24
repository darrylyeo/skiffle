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
					targetUrl: 'eip155:7777777:0x55f5a5d980992e01256d86e7ef03a22fd5fe84af',
				},
				{
					label: 'Tx',
					action: 'tx',
					targetUrl: '/tx',
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
