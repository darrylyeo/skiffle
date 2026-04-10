import { snapBackButton } from '$/lib/snap-components'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({
	parent,
}) => {
	const parentData = await parent()

	return {
		...parentData,

		snap: {
			buttons: [
				snapBackButton('..'),
			],
		},

		frame: {
			buttons: [
				{
					label: '‹ Back',
					action: 'post',
					targetUrl: '..',
				},
			]
		}
	}
}
