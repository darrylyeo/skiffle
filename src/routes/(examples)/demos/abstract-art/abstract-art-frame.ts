// Types
import type { FrameMeta } from '$/lib/frame'
import type { AppSnapPage } from '$/lib/snap-components'

// Functions
import { frameButtons } from '$/lib/frame'
import { snapButtonGroup, snapTargetButton } from '$/lib/snap-components'
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import { SnapButtonVariants, SnapDirections, SnapGaps, SnapJustifyValues, SnapPaletteColors } from '$/lib/snap-spec'

export type AbstractArtState = {
	seed: number
	palette: number
}

export type AbstractArtShape = {
	id: string
	style: string
}

export type AbstractArtView = {
	title: string
	paletteName: string
	caption: string
	sceneStyle: string
	backgroundStyle: string
	veilStyle: string
	shapes: AbstractArtShape[]
}

const PALETTES = [
	{
		name: 'Sunset Relay',
		accent: SnapPaletteColors.Amber,
		shadow: '#26162f',
		background: ['#221433', '#472a3c'],
		colors: ['#ff8a5b', '#ffd166', '#7c5cff', '#53c6a9'],
	},
	{
		name: 'Signal Bloom',
		accent: SnapPaletteColors.Green,
		shadow: '#10222d',
		background: ['#132833', '#21455f'],
		colors: ['#8ef6e4', '#57b4ff', '#b794f4', '#ffe28a'],
	},
	{
		name: 'Velvet Arcade',
		accent: SnapPaletteColors.Purple,
		shadow: '#22122b',
		background: ['#1d1634', '#3a214d'],
		colors: ['#ff7ab6', '#ff9b71', '#a78bfa', '#6ee7b7'],
	},
] as const

const CAPTIONS = [
	'Layered gradients, shadows, borders, transforms, and texture-like beams.',
	'Every refresh keeps the same route but remixes the composition from the URL state.',
	'Built to stay decorative while remaining within Satori-safe CSS territory.',
] as const

const normalizeSeed = (value: number) => (
	Math.max(1, Math.abs(Number.isFinite(value) ? Math.floor(value) : 1)) % 2_147_483_647
)

const normalizePalette = (value: number) => (
	((Number.isFinite(value) ? Math.floor(value) : 0) % PALETTES.length + PALETTES.length) % PALETTES.length
)

const nextRandom = (value: number) => (
	(value * 48_271) % 2_147_483_647
)

const random = (seed: number) => {
	let value = normalizeSeed(seed)

	return () => {
		value = nextRandom(value)
		return value / 2_147_483_647
	}
}

const rgba = (
	hex: string,
	alpha: number,
) => {
	const value = hex.replace('#', '')
	const red = Number.parseInt(value.slice(0, 2), 16)
	const green = Number.parseInt(value.slice(2, 4), 16)
	const blue = Number.parseInt(value.slice(4, 6), 16)

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const pickColor = (
	colors: readonly string[],
	index: number,
) => (
	colors[index % colors.length]
)

const percent = (value: number) => (
	`${value.toFixed(1)}%`
)

const blobStyle = (
	index: number,
	rand: () => number,
	colors: readonly string[],
	shadow: string,
) => {
	const left = rand() * 68
	const top = rand() * 68
	const width = 18 + rand() * 30
	const height = 16 + rand() * 26
	const angle = -55 + rand() * 110
	const skewX = -16 + rand() * 32
	const skewY = -10 + rand() * 20
	const colorA = pickColor(colors, index)
	const colorB = pickColor(colors, index + 1)

	return `left:${percent(left)};top:${percent(top)};width:${percent(width)};height:${percent(height)};border-radius:${28 + rand() * 32}% ${36 + rand() * 26}% ${30 + rand() * 30}% ${40 + rand() * 24}%;background:linear-gradient(${Math.round(rand() * 180)}deg, ${rgba(colorA, 0.94)}, ${rgba(colorB, 0.28)});border:1px solid ${rgba(colorA, 0.28)};box-shadow:0 16px 40px ${rgba(shadow, 0.22)};opacity:${(0.58 + rand() * 0.28).toFixed(2)};transform:rotate(${angle.toFixed(1)}deg) skew(${skewX.toFixed(1)}deg, ${skewY.toFixed(1)}deg);`
}

const beamStyle = (
	index: number,
	rand: () => number,
	colors: readonly string[],
) => {
	const left = -8 + rand() * 24
	const top = rand() * 88
	const width = 64 + rand() * 54
	const height = 2 + rand() * 8
	const angle = -60 + rand() * 120
	const color = pickColor(colors, index + 2)

	return `left:${percent(left)};top:${percent(top)};width:${percent(width)};height:${height.toFixed(1)}%;border-radius:999px;background:linear-gradient(90deg, ${rgba(color, 0)}, ${rgba(color, 0.58)}, ${rgba(color, 0)});opacity:${(0.34 + rand() * 0.24).toFixed(2)};transform:rotate(${angle.toFixed(1)}deg);`
}

const ringStyle = (
	index: number,
	rand: () => number,
	colors: readonly string[],
	shadow: string,
) => {
	const left = rand() * 72
	const top = rand() * 72
	const size = 12 + rand() * 26
	const color = pickColor(colors, index + 3)

	return `left:${percent(left)};top:${percent(top)};width:${percent(size)};height:${percent(size)};border-radius:999px;border:${(2 + rand() * 4).toFixed(1)}px solid ${rgba(color, 0.28)};background:radial-gradient(circle, ${rgba(color, 0.08)} 0%, ${rgba(color, 0)} 68%);box-shadow:0 0 0 1px ${rgba(shadow, 0.08)} inset;opacity:${(0.48 + rand() * 0.2).toFixed(2)};transform:rotate(${(-25 + rand() * 50).toFixed(1)}deg) scale(${(0.86 + rand() * 0.5).toFixed(2)});`
}

export const parseAbstractArtState = (url: URL): AbstractArtState => ({
	seed: normalizeSeed(Number(url.searchParams.get('seed') ?? 1)),
	palette: normalizePalette(Number(url.searchParams.get('palette') ?? 0)),
})

export const abstractArtStateFromHref = (href: string | undefined) => {
	if (!href) {
		return undefined
	}

	try {
		return parseAbstractArtState(new URL(href))
	} catch {
		return undefined
	}
}

export const freshAbstractArtState = (seed: number): AbstractArtState => ({
	seed: normalizeSeed(seed),
	palette: normalizePalette(seed),
})

export const nextAbstractArtSeed = (state: AbstractArtState) => (
	normalizeSeed(nextRandom(state.seed + state.palette + 17))
)

export const nextAbstractArtPalette = (palette: number) => (
	normalizePalette(palette + 1)
)

const sceneParams = (state: AbstractArtState) => (
	new URLSearchParams({
		seed: String(state.seed),
		palette: String(state.palette),
	})
)

export const abstractArtView = (state: AbstractArtState): AbstractArtView => {
	const palette = PALETTES[state.palette]
	const rand = random(state.seed + state.palette * 997)
	const title = `${palette.name} #${String(state.seed).slice(-4)}`
	const caption = CAPTIONS[(state.seed + state.palette) % CAPTIONS.length]
	const shapes = [
		...Array.from({ length: 5 }, (_, index) => ({
			id: `blob:${index}`,
			style: blobStyle(index, rand, palette.colors, palette.shadow),
		})),
		...Array.from({ length: 4 }, (_, index) => ({
			id: `beam:${index}`,
			style: beamStyle(index, rand, palette.colors),
		})),
		...Array.from({ length: 3 }, (_, index) => ({
			id: `ring:${index}`,
			style: ringStyle(index, rand, palette.colors, palette.shadow),
		})),
	]

	return {
		title,
		paletteName: palette.name,
		caption,
		sceneStyle: `background:radial-gradient(circle at 18% 18%, ${rgba(palette.colors[0], 0.34)}, transparent 26%), radial-gradient(circle at 82% 16%, ${rgba(palette.colors[1], 0.26)}, transparent 24%), radial-gradient(circle at 50% 100%, ${rgba(palette.colors[2], 0.18)}, transparent 38%), linear-gradient(135deg, ${palette.background[0]}, ${palette.background[1]}); border:1px solid ${rgba('#ffffff', 0.1)}; box-shadow:inset 0 1px 0 ${rgba('#ffffff', 0.12)}, 0 24px 60px ${rgba(palette.shadow, 0.34)};`,
		backgroundStyle: `background:radial-gradient(circle at 18% 18%, ${rgba(palette.colors[0], 0.28)}, transparent 26%), radial-gradient(circle at 82% 16%, ${rgba(palette.colors[1], 0.2)}, transparent 24%), radial-gradient(circle at 50% 100%, ${rgba(palette.colors[2], 0.16)}, transparent 38%), linear-gradient(135deg, ${palette.background[0]}, ${palette.background[1]});`,
		veilStyle: `background:linear-gradient(135deg, ${rgba('#ffffff', 0.12)}, ${rgba('#ffffff', 0)} 32%, ${rgba(palette.colors[3], 0.08)} 64%, ${rgba('#ffffff', 0)}); opacity:0.9; transform:rotate(${(-8 + rand() * 16).toFixed(1)}deg) scale(1.08);`,
		shapes,
	}
}

export const abstractArtBackgroundView = (
	seed: number,
	palette: number,
) => (
	abstractArtView({
		seed: normalizeSeed(seed),
		palette: normalizePalette(palette),
	})
)

export const buildAbstractArtFrame = (state: AbstractArtState): FrameMeta => ({
	image: {
		url: `/demos/abstract-art?${sceneParams(state)}`,
		aspectRatio: '1:1',
	},
	buttons: frameButtons(
		{
			label: '‹ Demos',
			action: 'post',
			targetUrl: '/?/demos',
		},
		{
			label: 'Remix',
			action: 'post',
			targetUrl: `/demos/abstract-art?/remix&${sceneParams(state)}`,
		},
		{
			label: 'Palette',
			action: 'post',
			targetUrl: `/demos/abstract-art?/palette&${sceneParams(state)}`,
		},
	),
})

export const buildAbstractArtSnap = (state: AbstractArtState): AppSnapPage => ({
	shareText: `Trying the Abstract Art demo in SKIFFLE. ${abstractArtView(state).title}.`,
	theme: {
		accent: PALETTES[normalizePalette(state.palette)].accent,
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
					label: 'Remix',
					role: AppSnapButtonRoles.Cta,
					variant: SnapButtonVariants.Primary,
					action: 'post',
					targetUrl: `/demos/abstract-art?/remix&${sceneParams(state)}`,
				}),
				snapTargetButton({
					label: 'Palette',
					action: 'post',
					targetUrl: `/demos/abstract-art?/palette&${sceneParams(state)}`,
				}),
			],
		}),
	],
})
