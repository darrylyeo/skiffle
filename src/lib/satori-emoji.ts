import { existsSync, readFileSync } from 'fs'
import twemoji from 'twemoji'

const installedTwemojiSvgPath = (code: string) => (
	`${process.cwd()}/node_modules/@datawrapper/twemoji-svg/svg/${code}.svg`
)

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

const fontArrayBuffer = (pkg: string, file: string) => {
	const buffer = readFileSync(`${process.cwd()}/node_modules/${pkg}/files/${file}`)
	return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

const installedEmojiSvg = (code: string) => (
	existsSync(installedTwemojiSvgPath(code))
		? readFileSync(installedTwemojiSvgPath(code), 'utf8')
		: undefined
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

const japaneseFallbackFonts = () => (
	fontCache.get('ja-JP')
		?? cacheFonts(
			'ja-JP',
			[
				{
					name: 'Noto Sans JP',
					data: fontArrayBuffer('@fontsource/noto-sans-jp', 'noto-sans-jp-japanese-400-normal.woff'),
					style: 'normal',
					weight: 400,
					lang: 'ja-JP',
				},
			],
		)
)

const symbolFallbackFonts = () => (
	fontCache.get('unknown')
		?? cacheFonts(
			'unknown',
			[
				{
					name: 'Noto Sans Symbols 2',
					data: fontArrayBuffer('@fontsource/noto-sans-symbols-2', 'noto-sans-symbols-2-symbols-400-normal.woff'),
					style: 'normal',
					weight: 400,
				},
			],
		)
)

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

	const localSvg = installedEmojiSvg(code)
	if (localSvg) {
		const dataUrl = dataUrlFromSvg(localSvg)
		emojiCache.set(segment, dataUrl)
		return dataUrl
	}

	missingEmojiCache.add(segment)
	return undefined
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
		return japaneseFallbackFonts()
	}

	if (languageCode === 'unknown' || isEmojiSegment(languageCode, segment) || /[\u2190-\u2bff\u0336]/.test(segment)) {
		return symbolFallbackFonts()
	}

	return undefined
}
