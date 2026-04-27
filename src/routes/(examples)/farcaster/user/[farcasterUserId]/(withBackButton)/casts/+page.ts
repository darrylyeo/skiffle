// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { findSnapButtonByRole } from '$/lib/snap-components'
import { isTruthy } from '$/lib/isTruthy'
import type { PageLoad } from './$types'
import type { FrameMeta } from '$/lib/frame'


// Data
export const load: PageLoad = async ({
	parent,
	data,
}) => {
	const parentData = await parent()

	return {
		...data,
		title: `${parentData.user.display_name} casts`,
		snap: {
			castIntent: {
				text: `Browsing ${parentData.user.display_name}'s recent casts on the SKIFFLE demo snapsite 🗨️`,
			},
			buttons: [
				findSnapButtonByRole(parentData.snap?.buttons, AppSnapButtonRoles.Back),
			].filter(isTruthy),
		},

		frame: {
			image: {
				aspectRatio: '1:1',
			},
			buttons: [
				parentData.frame.buttons[0],
			],
		} as FrameMeta,
	}
}
