// Tyoes
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { findSnapButtonByRole, snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { isTruthy } from '$/lib/isTruthy'
import type { FrameMeta } from '$/lib/frame'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues } from '$/lib/snap-spec'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	parent,
}) => {
	const parentData = await parent()

	return {
		...parentData,
		title: `${parentData.user.display_name} (@${parentData.user.username})`,
		snap: {
			castIntent: {
				text: `Viewing ${parentData.user.display_name} (@${parentData.user.username})'s profile on the SKIFFLE demo snapsite 👤`,
			},
			buttons: [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: [
						findSnapButtonByRole(parentData.snap?.buttons, AppSnapButtonRoles.Back),
						snapTargetButton({
							label: 'Casts',
							role: AppSnapButtonRoles.Cta,
							variant: SnapButtonVariants.Primary,
							action: 'post',
							targetUrl: './casts',
						}),
					].filter(isTruthy),
				}),
			],
		},

		frame: {
			buttons: [
				parentData.frame.buttons[0],
				{
					label: 'Casts',
					action: 'post',
					targetUrl: './casts',
				},
			],
		} as FrameMeta,
	}
}
