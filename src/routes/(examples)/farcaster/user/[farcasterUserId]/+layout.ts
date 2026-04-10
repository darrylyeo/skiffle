import { snapBackButton } from '$/lib/snap-components'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({
	data,
}) => {
	return {
		...data,

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
