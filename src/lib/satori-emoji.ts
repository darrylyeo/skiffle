import twemoji from 'twemoji'


const twemojiSvgUrl = (code: string) => (
	`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`
)

const dataUrlFromSvg = (svg: string) => (
	`data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`
)

const cache = new Map<string, string>()

/**
 * Satori `loadAdditionalAsset` hook: map `emoji` graphemes to Twemoji SVG data URLs.
 * @see https://github.com/vercel/satori — color emoji fonts are not supported; use images.
 */
export const loadSatoriEmojiAsset = async (
	languageCode: string,
	segment: string,
) => {
	if (languageCode !== 'emoji') {
		return undefined
	}

	const cached = cache.get(segment)
	if (cached) {
		return cached
	}

	const code = twemoji.convert.toCodePoint(segment)
	const res = await fetch(twemojiSvgUrl(code))
	if (!res.ok) {
		return undefined
	}

	const dataUrl = dataUrlFromSvg(await res.text())
	cache.set(segment, dataUrl)
	return dataUrl
}
