// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

// Data
import type { Actions, PageServerLoad } from './$types'

const TIPS = [
	'Frame buttons POST to SvelteKit form actions using `?/actionName` targets on the same route.',
	'One SKIFFLE URL can serve HTML, a rendered PNG preview, or Snap JSON depending on the request.',
	'Demo state lives in the URL so every next image render stays aligned with the next action target.',
	'Snaps layer richer controls on top of those same routes instead of needing a separate app surface.',
	'When tunneling locally, set `SNAP_PUBLIC_BASE_URL` so public image and submit URLs stay correct.',
] as const

const len = TIPS.length

const normTipIndex = (i: number) => {
	const n = Number.isFinite(i) ? Math.floor(i) : 0
	return ((n % len) + len) % len
}

const tipsPagination = (url: URL) => {
	const currentPage = normTipIndex(Number(url.searchParams.get('page') ?? 0))
	const totalPages = TIPS.length

	return {
		currentPage,
		totalPages,
		message: TIPS[currentPage],
	}
}

const tipsPageView = (url: URL): {
	currentPage: number
	totalPages: number
	message: string
	frame: FrameMeta
	snap: AppSnapPage
} => {
	const {
		currentPage,
		totalPages,
		message,
	} = tipsPagination(url)
	const nextPage = normTipIndex(currentPage + 1)

	return {
		currentPage,
		totalPages,
		message,
		frame: {
			image: {
				url: `/demos/tips?page=${currentPage}`,
				aspectRatio: '1.91:1',
			},
			buttons: (
				[
					{
						label: '‹ Demos',
						action: 'post',
						targetUrl: '/?/demos',
					},
					currentPage < totalPages - 1
						? {
							label: 'Next Tip ›',
							action: 'post',
							targetUrl: `/demos/tips?/paginate&page=${nextPage}`,
						}
						: {
							label: 'Back to Top ›',
							action: 'post',
							targetUrl: '/demos/tips?/paginate&page=0',
						},
				] as const
			)
				.filter(isTruthy)
				.slice(0, 4) as FrameMeta['buttons'],
		},
		snap: {
			shareText: `Reading tip ${currentPage + 1} of ${totalPages} in the SKIFFLE demo. ${message}`,
			theme: {
				accent: SnapPaletteColors.Amber,
			},
			buttons: [
				snapButtonGroup({
					direction: SnapDirections.Horizontal,
					gap: SnapGaps.Sm,
					justify: SnapJustifyValues.Center,
					children: [
						snapTargetButton({
							label: '‹ Demos',
							role: AppSnapButtonRoles.Back,
							action: 'post',
							targetUrl: '/?/demos',
						}),
						currentPage < totalPages - 1
							? snapTargetButton({
								label: 'Next Tip ›',
								role: AppSnapButtonRoles.Pager,
								variant: SnapButtonVariants.Primary,
								action: 'post',
								targetUrl: `/demos/tips?/paginate&page=${nextPage}`,
							})
							: snapTargetButton({
								label: 'Back to Top ›',
								role: AppSnapButtonRoles.Pager,
								variant: SnapButtonVariants.Primary,
								action: 'post',
								targetUrl: '/demos/tips?/paginate&page=0',
							}),
					],
				}),
			],
		},
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const {
		currentPage,
		totalPages,
		message,
		frame,
		snap,
	} = tipsPageView(url)

	return {
		tipIndex: currentPage,
		tipCount: totalPages,
		message,
		title: `Tip carousel · Tip ${currentPage + 1} of ${totalPages}`,
		frame,
		snap,
	}
}

const frameAction = async ({ url }: { url: URL }) => {
	const {
		frame,
		snap,
	} = tipsPageView(url)

	return {
		frame,
		snap,
	}
}

export const actions: Actions = {
	open: frameAction,
	paginate: frameAction,
}
