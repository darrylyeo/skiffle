import { readFileSync } from 'fs'

import { absolutePathFontsourceFile } from '$/lib/npm-package-path'

const readFont = (pkg: string, file: string) => (
	readFileSync(absolutePathFontsourceFile(pkg, file))
)

const familyFonts = (
	name: string,
	pkg: string,
	subsets: string[],
	weights: number[],
) => (
	subsets.flatMap((subset) => (
		weights.map((weight) => ({
			name,
			data: readFont(pkg, `${pkg.split('/').at(-1)}-${subset}-${weight}-normal.woff`),
			style: 'normal' as const,
			weight,
		}))
	))
)

export const fonts = ([
	...familyFonts(
		'Fira Code',
		'@fontsource/fira-code',
		[
			'latin',
			'latin-ext',
			'greek',
			'greek-ext',
			'cyrillic',
			'cyrillic-ext',
			'symbols2',
		],
		[
			400,
			500,
			600,
			700,
		],
	),
	...familyFonts(
		'Ubuntu',
		'@fontsource/ubuntu',
		[
			'latin',
			'latin-ext',
			'greek',
			'greek-ext',
			'cyrillic',
			'cyrillic-ext',
		],
		[
			400,
			500,
			700,
		],
	),
] as const)
	.filter(font => font.data)
