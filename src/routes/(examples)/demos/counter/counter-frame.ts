// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'

// Functions
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

export const clampCount = (n: number) => (
	Math.max(0, Math.min(9_999, Number.isFinite(n) ? Math.floor(n) : 0))
)

const counterActionDeltas = (count: number) => (
	[
		1,
		10,
		...(count >= 37 ? [37] : []),
	]
)

export const counterPrimeFactorization = (count: number) => {
	const c = clampCount(count)

	if (c === 0) {
		return 'prime factorization: undefined for 0'
	}

	if (c === 1) {
		return 'prime factorization: 1'
	}

	const factors: string[] = []
	let remaining = c
	let divisor = 2

	while (divisor * divisor <= remaining) {
		let exponent = 0

		while (remaining % divisor === 0) {
			remaining /= divisor
			exponent += 1
		}

		if (exponent > 0) {
			factors.push(exponent > 1 ? `${divisor}^${exponent}` : `${divisor}`)
		}

		divisor += divisor === 2 ? 1 : 2
	}

	if (remaining > 1) {
		factors.push(`${remaining}`)
	}

	return `prime factorization: ${factors.join(' * ')}`
}

export const counterShareText = (count: number) => (
	`How high can you go? I pushed the SKIFFLE counter demo to ${clampCount(count)}. Try it in /count.`
)

export const counterFrameMeta = (count: number): FrameMeta => {
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
			...counterActionDeltas(c).map((delta) => ({
				label: `+${delta}`,
				action: 'post',
				targetUrl: `/demos/counter?/bump&count=${c}&delta=${delta}`,
			})),
		],
	}
}

export const counterSnap = (count: number): AppSnapPage => {
	const c = clampCount(count)

	return {
		shareText: counterShareText(c),
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
					...counterActionDeltas(c)
						.map((delta) => (
							snapTargetButton({
								label: `+${delta}`,
								role: AppSnapButtonRoles.Cta,
								variant: SnapButtonVariants.Primary,
								action: 'post',
								targetUrl: `/demos/counter?/bump&count=${c}&delta=${delta}`,
							})
						)),
				],
			}),
		],
	}
}
