import { snapBackButton } from '$/lib/snap-components'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async () => {
	return {
		snap: {
			buttons: [
				snapBackButton('/'),
			],
		},
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
