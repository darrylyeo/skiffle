// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'
import { demosBackUrl } from '$/routes/(examples)/demos'

// Functions
import { isTruthy } from '$/lib/isTruthy'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

export const TIPS = [
	'One SKIFFLE route can respond with HTML, a rendered frame image, or Farcaster Snap JSON depending on the request.',
	'Frame and Snap actions reuse normal SvelteKit form actions, so the same route keeps handling the interaction loop.',
	'This demo keeps its current slide in the URL, so every next render stays aligned with the next action target.',
	'SKIFFLE renders frame images from the route HTML and CSS through Satori, then converts the SVG output to PNG.',
	'When testing through a public tunnel, `SNAP_PUBLIC_BASE_URL` keeps Snap image and submit targets pointed at the public origin.',
] as const

const len = TIPS.length

export const normTipIndex = (i: number) => {
	const n = Number.isFinite(i) ? Math.floor(i) : 0
	return ((n % len) + len) % len
}

export const tipsPagination = (url: URL) => {
	const currentPage = normTipIndex(Number(url.searchParams.get('page') ?? 0))
	const totalPages = TIPS.length

	return {
		currentPage,
		totalPages,
		message: TIPS[currentPage],
	}
}

const frameMetaFromPaginationState = ({
	currentPage,
	totalPages,
}: ReturnType<typeof tipsPagination>): FrameMeta => {
	const nextPage = normTipIndex(currentPage + 1)

	return {
		image: {
			url: `/demos/tips?page=${currentPage}`,
			aspectRatio: '1.91:1',
		},
		buttons: (
			[
				{
					label: '‹ Demos',
					action: 'post',
					targetUrl: demosBackUrl('tips'),
				},
				currentPage < totalPages - 1
					? {
						label: 'Next Slide ›',
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
	}
}

const snapFromPaginationState = ({
	currentPage,
	totalPages,
	message,
}: ReturnType<typeof tipsPagination>): AppSnapPage => {
	const nextPage = normTipIndex(currentPage + 1)

	return {
		castIntent: {
			text: `Viewing slide ${currentPage + 1} of ${totalPages} in SKIFFLE Tips. ${message}`,
		},
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
						targetUrl: demosBackUrl('tips'),
					}),
					currentPage < totalPages - 1
						? snapTargetButton({
							label: 'Next Slide ›',
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
	}
}

export const tipsPageView = (url: URL) => {
	const state = tipsPagination(url)
	return {
		...state,
		frame: frameMetaFromPaginationState(state),
		snap: snapFromPaginationState(state),
	}
}
