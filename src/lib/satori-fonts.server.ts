import { getRequestEvent } from '$app/server'

/** Resolve Vite `?url` imports (absolute, site-relative, or `data:`) for same-origin fetch. */
export const resolveBundledAssetHref = (url: string, origin: string) => (
	url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') ?
		url
	: url.startsWith('/') ?
		`${origin}${url}`
	:
		new URL(url, `${origin}/`).href
)

export const fetchBundledAssetBuffer = async (url: string) => {
	const origin = new URL(getRequestEvent().request.url).origin
	const href = resolveBundledAssetHref(url, origin)
	const response = await fetch(href)
	if (!response.ok) {
		throw new Error(`bundled asset fetch failed ${response.status}: ${href}`)
	}
	return response.arrayBuffer()
}

const woffUrlFromBasename = (
	glob: Record<string, string>,
	basename: string,
) => (
	Object.entries(glob).find(([path]) => (
		path.endsWith(`/${basename}`)
		|| path.endsWith(basename)
	))?.[1]
)

const firaWoffs = import.meta.glob(
	'/node_modules/@fontsource/fira-code/files/fira-code-*.woff',
	{ eager: true, import: 'default', query: '?url' },
) as Record<string, string>

const ubuntuWoffs = import.meta.glob(
	'/node_modules/@fontsource/ubuntu/files/ubuntu-*.woff',
	{ eager: true, import: 'default', query: '?url' },
) as Record<string, string>

const familyFonts = async (
	name: string,
	glob: Record<string, string>,
	shortName: string,
	subsets: string[],
	weights: number[],
) => (
	Promise.all(
		subsets.flatMap((subset) => (
			weights.map(async (weight) => {
				const basename = `${shortName}-${subset}-${weight}-normal.woff`
				const url = woffUrlFromBasename(glob, basename)
				if (!url) {
					return undefined
				}
				return {
					name,
					data: await fetchBundledAssetBuffer(url),
					style: 'normal' as const,
					weight,
				}
			})
		)),
	)
		.then((fonts) => (
			fonts.filter((font): font is NonNullable<typeof font> => Boolean(font))
		))
)

const loadSatoriFonts = async () => ([
	...await familyFonts(
		'Fira Code',
		firaWoffs,
		'fira-code',
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
	...await familyFonts(
		'Ubuntu',
		ubuntuWoffs,
		'ubuntu',
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
])

let cache: Awaited<ReturnType<typeof loadSatoriFonts>> | undefined

export const getSatoriFonts = async () => (
	cache ??= await loadSatoriFonts()
)
