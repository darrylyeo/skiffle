const woffUrlFromBasename = (
	glob: Record<string, string>,
	basename: string,
) => (
	Object.entries(glob).find(([path]) => (
		path.endsWith(`/${basename}`)
		|| path.endsWith(basename)
	))?.[1]
)

const bufferFromAssetUrl = async (url: string, origin: string) => {
	const href = (
		url.startsWith('http://') || url.startsWith('https://')
			? url
		: url.startsWith('/')
			? `${origin}${url}`
		:
			new URL(url, `${origin}/`).href
	)
	const response = await fetch(href)
	if (!response.ok) {
		throw new Error(`font fetch failed ${response.status}: ${href}`)
	}
	return response.arrayBuffer()
}

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
	origin: string,
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
					data: await bufferFromAssetUrl(url, origin),
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

const loadSatoriFonts = async (origin: string) => ([
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
		origin,
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
		origin,
	),
])

let cache: Awaited<ReturnType<typeof loadSatoriFonts>> | undefined

export const getSatoriFonts = async (origin: string) => (
	cache ??= await loadSatoriFonts(origin)
)
