import { readFileSync } from 'fs'

const twemojiSvgUrl = (code: string) => (
	`https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${code}.svg`
)

const dataUrlFromSvg = (svg: string) => (
	`data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`
)

const emojiCache = new Map<string, string>()
const fontCache = new Map<string, {
	name: string,
	data: ArrayBuffer,
	style: 'normal',
	weight: 400,
	lang?: string,
}[]>()

const fontArrayBuffer = (pkg: string, file: string) => {
	const buffer = readFileSync(`${process.cwd()}/node_modules/${pkg}/files/${file}`)
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

const japaneseFallbackFonts = () => (
	fontCache.get('ja-JP')
		?? (
			[
				{
					name: 'Noto Sans JP',
					data: fontArrayBuffer('@fontsource/noto-sans-jp', 'noto-sans-jp-japanese-400-normal.woff'),
					style: 'normal' as const,
					weight: 400 as const,
					lang: 'ja-JP',
				},
			].map((font) => (
				font
			))
		)
)

const symbolFallbackFonts = () => (
	fontCache.get('unknown')
		?? (
			[
				{
					name: 'Noto Sans Symbols 2',
					data: fontArrayBuffer('@fontsource/noto-sans-symbols-2', 'noto-sans-symbols-2-symbols-400-normal.woff'),
					style: 'normal' as const,
					weight: 400 as const,
				},
			].map((font) => (
				font
			))
		)
)

const cacheFonts = (
	key: string,
	fonts: {
		name: string,
		data: ArrayBuffer,
		style: 'normal',
		weight: 400,
		lang?: string,
	}[],
) => (
	fontCache.set(key, fonts),
	fonts
)

const twemojiCodeFromSegment = (segment: string) => (
	[...segment]
		.map((char) => (
			char.codePointAt(0)?.toString(16)
		))
		.filter((code) => (
			code !== undefined
			&& code !== 'fe0f'
		))
		.join('-')
)

/**
 * Satori `loadAdditionalAsset` hook: map `emoji` graphemes to Twemoji SVG data URLs.
 * @see https://github.com/vercel/satori — color emoji fonts are not supported; use images.
 */
export const loadSatoriAdditionalAsset = async (
	languageCode: string,
	segment: string,
) => {
	if (languageCode === 'emoji') {
		const cached = emojiCache.get(segment)
		if (cached) {
			return cached
		}

		const code = twemojiCodeFromSegment(segment)
		const res = await fetch(twemojiSvgUrl(code))
		if (!res.ok) {
			return undefined
		}

		const dataUrl = dataUrlFromSvg(await res.text())
		emojiCache.set(segment, dataUrl)
		return dataUrl
	}

	if (languageCode === 'ja-JP' || /[\u3000-\u30ff\u4e00-\u9fff]/.test(segment)) {
		return cacheFonts('ja-JP', japaneseFallbackFonts())
	}

	if (languageCode === 'unknown' || /[\u2190-\u2bff\u0336]/.test(segment)) {
		return cacheFonts('unknown', symbolFallbackFonts())
	}

	return undefined
}
