// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'

// Functions
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

// Data
import type { Actions, PageServerLoad } from './$types'

const clampCount = (n: number) => (
	Math.max(0, Math.min(9_999, Number.isFinite(n) ? Math.floor(n) : 0))
)

const counterFrameMeta = (count: number): FrameMeta => {
	const c = clampCount(count)

	return {
		image: {
			url: `/demos/counter?count=${c}`,
			aspectRatio: '1.91:1',
		},
		buttons: [
			{
				label: '‹ Demos',
				action: 'post',
				targetUrl: '/?/demos',
			},
			{
				label: '+1',
				action: 'post',
				targetUrl: `/demos/counter?/bump&count=${c}&delta=1`,
			},
			{
				label: '+10',
				action: 'post',
				targetUrl: `/demos/counter?/bump&count=${c}&delta=10`,
			},
			{
				label: 'Reset',
				action: 'post',
				targetUrl: '/demos/counter?/set&to=0',
			},
		],
	}
}

const counterSnap = (count: number): AppSnapPage => {
	const c = clampCount(count)

	return {
		shareText: `Trying the counter demo in SKIFFLE. Count is at ${c}.\n\nWant to keep it going?`,
		theme: {
			accent: SnapPaletteColors.Teal,
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
					snapTargetButton({
						label: '+1',
						role: AppSnapButtonRoles.Cta,
						variant: SnapButtonVariants.Primary,
						action: 'post',
						targetUrl: `/demos/counter?/bump&count=${c}&delta=1`,
					}),
				],
			}),
			snapButtonGroup({
				direction: SnapDirections.Horizontal,
				gap: SnapGaps.Sm,
				justify: SnapJustifyValues.Center,
				children: [
					snapTargetButton({
						label: '+10',
						role: AppSnapButtonRoles.Cta,
						variant: SnapButtonVariants.Primary,
						action: 'post',
						targetUrl: `/demos/counter?/bump&count=${c}&delta=10`,
					}),
					snapTargetButton({
						label: 'Reset',
						action: 'post',
						targetUrl: '/demos/counter?/set&to=0',
					}),
				],
			}),
		],
	}
}

const countFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return clampCount(Number(new URL(href).searchParams.get('count') ?? 0))
	} catch {
		return undefined
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const raw = url.searchParams.get('count')
	const count = raw === null || raw === ''
		? 0
		: clampCount(Number(raw))

	return {
		count,
		title: `Counter demo · ${count}`,
		frame: counterFrameMeta(count),
		snap: counterSnap(count),
	}
}

export const actions: Actions = {
	open: async () => ({
		frame: counterFrameMeta(0),
		snap: counterSnap(0),
	}),
	bump: async ({ locals, url }) => {
		const count = (
			countFromHref(locals.frameSignaturePacket?.untrustedData.url)
			?? clampCount(Number(url.searchParams.get('count') ?? 0))
		)
		const delta = Number(url.searchParams.get('delta') ?? 0)
		const nextCount = clampCount(
			count + (Number.isFinite(delta) ? delta : 0),
		)

		return {
			frame: counterFrameMeta(nextCount),
			snap: counterSnap(nextCount),
		}
	},
	set: async ({ url }) => ({
		frame: counterFrameMeta(clampCount(Number(url.searchParams.get('to') ?? 0))),
		snap: counterSnap(clampCount(Number(url.searchParams.get('to') ?? 0))),
	}),
}
