import { read } from '$app/server'
import notoJpWoffUrl from '@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-400-normal.woff?url'
import notoSymbolsWoffUrl from '@fontsource/noto-sans-symbols-2/files/noto-sans-symbols-2-symbols-400-normal.woff?url'
import twemoji from 'twemoji'

const twemojiSvgUrls = import.meta.glob(
	'/node_modules/@datawrapper/twemoji-svg/svg/*.svg',
	{ eager: true, import: 'default', query: '?url' },
) as Record<string, string>

const dataUrlFromSvg = (svg: string) => (
	`data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`
)

const emojiCache = new Map<string, string>()
const missingEmojiCache = new Set<string>()
const fontCache = new Map<string, {
	name: string,
	data: ArrayBuffer,
	style: 'normal',
	weight: 400,
	lang?: string,
}[]>()

const twemojiUrlForCode = (code: string) => (
	Object.entries(twemojiSvgUrls).find(([path]) => (
		path.endsWith(`/${code}.svg`)
		|| path.endsWith(`${code}.svg`)
	))?.[1]
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

const japaneseFallbackFonts = async () => {
	const cached = fontCache.get('ja-JP')
	if (cached) {
		return cached
	}
	const fonts = [
		{
			name: 'Noto Sans JP',
			data: await read(notoJpWoffUrl).arrayBuffer(),
			style: 'normal' as const,
			weight: 400,
			lang: 'ja-JP',
		},
	]
	return cacheFonts('ja-JP', fonts)
}

const symbolFallbackFonts = async () => {
	const cached = fontCache.get('unknown')
	if (cached) {
		return cached
	}
	const fonts = [
		{
			name: 'Noto Sans Symbols 2',
			data: await read(notoSymbolsWoffUrl).arrayBuffer(),
			style: 'normal' as const,
			weight: 400,
		},
	]
	return cacheFonts('unknown', fonts)
}

const twemojiCodeFromSegment = (segment: string) => (
	twemoji.convert
		.toCodePoint(segment)
		.split('-')
		.filter((code) => (
			code !== 'fe0f'
		))
		.join('-')
)

const emojiLikeSegmentPattern = /[\p{Extended_Pictographic}\p{Regional_Indicator}\u{1f3fb}-\u{1f3ff}\u200d\u20e3\u{e0020}-\u{e007f}]/u

const isEmojiSegment = (
	languageCode: string,
	segment: string,
) => (
	languageCode === 'emoji'
	|| emojiLikeSegmentPattern.test(segment)
)

const emojiDataUrlForSegment = async (segment: string) => {
	if (missingEmojiCache.has(segment)) {
		return undefined
	}

	const cached = emojiCache.get(segment)
	if (cached) {
		return cached
	}

	const code = twemojiCodeFromSegment(segment)
	if (!code) {
		missingEmojiCache.add(segment)
		return undefined
	}

	const url = twemojiUrlForCode(code)
	if (!url) {
		missingEmojiCache.add(segment)
		return undefined
	}

	// Vite often inlines small SVGs as `data:` URLs. `read()` decodes the payload
	// with `decodeURIComponent`, which can throw on some encodings; `fetch(data:)`
	// follows the same URL semantics as browsers and Node.
	const svg = (
		url.startsWith('data:') ?
			await fetch(url).then((response) => response.text())
		:
			await read(url).text()
	)
	const dataUrl = dataUrlFromSvg(svg)
	emojiCache.set(segment, dataUrl)
	return dataUrl
}

export const loadSatoriAdditionalAsset = async (
	languageCode: string,
	segment: string,
) => {
	if (isEmojiSegment(languageCode, segment)) {
		const dataUrl = await emojiDataUrlForSegment(segment)
		if (dataUrl) {
			return dataUrl
		}
	}

	if (languageCode === 'ja-JP' || /[\u3000-\u30ff\u4e00-\u9fff]/.test(segment)) {
		return await japaneseFallbackFonts()
	}

	if (languageCode === 'unknown' || isEmojiSegment(languageCode, segment) || /[\u2190-\u2bff\u0336]/.test(segment)) {
		return await symbolFallbackFonts()
	}

	return undefined
}
