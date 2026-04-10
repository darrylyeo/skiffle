// Functions
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { findSnapButtonByRole, snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { isTruthy } from '$/lib/isTruthy'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues } from '$/lib/snap-spec'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	parent,
	url,
}) => {
	const parentData = await parent()

	const currentPage = Number(url.searchParams.get('page') ?? 0)
	const totalPages = 6

	return {
		currentPage,
		totalPages,
		title: 'About SKIFFLE',
		snap: {
			shareText: 'Reading the SKIFFLE project overview: the same SvelteKit routes can serve HTML, frame previews, and Snap JSON.',
			buttons: [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: [
						findSnapButtonByRole(parentData.snap?.buttons, AppSnapButtonRoles.Back),
						currentPage > 0 && snapTargetButton({
							label: '‹ Previous Page',
							role: AppSnapButtonRoles.Pager,
							action: 'post',
							targetUrl: `?page=${currentPage - 1}`,
						}),
						currentPage < totalPages - 1
							? snapTargetButton({
								label: 'Next Page ›',
								role: AppSnapButtonRoles.Pager,
								variant: SnapButtonVariants.Primary,
								action: 'post',
								targetUrl: `?page=${currentPage + 1}`,
							})
							: snapTargetButton({
								label: '⟲ Read again',
								role: AppSnapButtonRoles.Pager,
								variant: SnapButtonVariants.Primary,
								action: 'post',
								targetUrl: '?page=0',
							}),
					].filter(isTruthy),
				}),
			],
		},

		frame: {
			buttons: [
				parentData.frame.buttons[0],
				currentPage > 0 && {
					label: '‹ Previous Page',
					action: 'post',
					targetUrl: `?page=${currentPage - 1}`,
				},
				currentPage < totalPages - 1 && {
					label: 'Next Page ›',
					action: 'post',
					targetUrl: `?page=${currentPage + 1}`,
				},
				currentPage === totalPages - 1 && {
					label: '⟲ Read again',
					action: 'post',
					targetUrl: `?page=0`,
				},
			].filter(isTruthy),
		}
	}
}
