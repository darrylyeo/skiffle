// Types
import type { FrameMeta } from '$/lib/frame'

// Functions
import { isTruthy } from '$/lib/isTruthy'

export const TIPS = [
	'Frame buttons can POST to SvelteKit form actions on the same app.',
	'One route serves HTML, the PNG preview (Satori → ResVG), and Snap JSON.',
	'Button targets can carry query state so the next frame image matches.',
	'Set fc:frame:image to a clean URL when action query strings would confuse GETs.',
	'Pin SKIFFLE demos in a Farcaster client to try stateful frames end to end.',
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
			url: `/farcaster/demos/tips?page=${currentPage}`,
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
						targetUrl: `/farcaster/demos/tips?/paginate&page=${nextPage}`,
					}
					: {
						label: 'Back to Top ›',
						action: 'post',
						targetUrl: '/farcaster/demos/tips?/paginate&page=0',
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
