import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)

export const absolutePathFontsourceFile = (pkg: string, file: string) => (
	require.resolve(`${pkg}/files/${file}`)
)

export const absolutePathTwemojiSvg = (code: string) => (
	join(
		dirname(require.resolve('@datawrapper/twemoji-svg/package.json')),
		'svg',
		`${code}.svg`,
	)
)
