import { snapBackButton } from '$/lib/snap-components'
import { demosBackUrl } from '$/routes/(examples)/demos'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({
	data,
}) => {
	return {
		...data,

		snap: {
			buttons: [
				snapBackButton(demosBackUrl('profile')),
			],
		},

		frame: {
			buttons: [
				{
					label: '‹ Back',
					action: 'post',
					targetUrl: demosBackUrl('profile'),
				},
			]
		}
	}
}
