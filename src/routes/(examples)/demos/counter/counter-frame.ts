// Types
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { AppSnapPage } from '$/lib/snap-components'
import type { FrameMeta } from '$/lib/frame'
import { demosBackUrl } from '$/routes/(examples)/demos'

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

export type CounterPrimePower = {
	prime: number
	exp: number
}

/** Prime powers in ascending prime order; empty for n ∈ {0, 1}. */
export const counterPrimeFactorTuples = (count: number): CounterPrimePower[] => {
	const c = clampCount(count)

	if (c < 2) {
		return []
	}

	const powers: CounterPrimePower[] = []
	let remaining = c
	let divisor = 2

	while (divisor * divisor <= remaining) {
		let exponent = 0

		while (remaining % divisor === 0) {
			remaining /= divisor
			exponent += 1
		}

		if (exponent > 0) {
			powers.push({ prime: divisor, exp: exponent })
		}

		divisor += divisor === 2 ? 1 : 2
	}

	if (remaining > 1) {
		powers.push({ prime: remaining, exp: 1 })
	}

	return powers
}

const digitToSuperscript: Record<string, string> = {
	'0': '⁰',
	'1': '¹',
	'2': '²',
	'3': '³',
	'4': '⁴',
	'5': '⁵',
	'6': '⁶',
	'7': '⁷',
	'8': '⁸',
	'9': '⁹',
}

const exponentUnicode = (exp: number) => (
	exp <= 1
		? ''
		: String(exp)
			.split('')
			.map((d) => digitToSuperscript[d] ?? d)
			.join('')
)

/** Unicode factorization line, e.g. `n = 2² × 3`. */
export const counterPrimeFactorization = (count: number) => {
	const c = clampCount(count)

	if (c === 0) {
		return 'n = 0'
	}

	if (c === 1) {
		return 'n = 1'
	}

	const powers = counterPrimeFactorTuples(count)

	if (powers.length === 1 && powers[0].exp === 1) {
		return 'Prime!'
	}

	const parts = powers.map(({ prime, exp }) => (
		`${prime}${exponentUnicode(exp)}`
	))

	return `n = ${parts.join(' × ')}`
}

export const counterShareText = (count: number) => (
	`The counter is ${clampCount(count)} on the SKIFFLE demo snapsite 🔢`
)

export const counterFrameMeta = (count: number): FrameMeta => {
	const c = clampCount(count)

	return {
		image: {
			url: `/demos/counter?count=${c}`,
			aspectRatio: '16:9',
		},
		buttons: [
			{
				label: '‹ Demos',
				action: 'post',
				targetUrl: demosBackUrl('counter'),
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
		castIntent: {
			text: counterShareText(c),
		},
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
						targetUrl: demosBackUrl('counter'),
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
