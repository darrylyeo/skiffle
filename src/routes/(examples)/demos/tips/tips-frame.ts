// Types
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'

export const TIPS = [
	'Frame buttons POST to SvelteKit form actions using `?/actionName` targets on the same route.',
	'One SKIFFLE URL can serve HTML, a rendered PNG preview, or Snap JSON depending on the request.',
	'Demo state lives in the URL so every next image render stays aligned with the next action target.',
	'Snaps layer richer controls on top of those same routes instead of needing a separate app surface.',
	'When tunneling locally, set `SNAP_PUBLIC_BASE_URL` so public image and submit URLs stay correct.',
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
	}
}

export const tipsPageView = (url: URL) => {
	const state = tipsPagination(url)
	return {
		...state,
		frame: frameMetaFromPaginationState(state),
	}
}

export const buildTipsFrame = (url: URL): FrameMeta => (
	tipsPageView(url).frame
)
