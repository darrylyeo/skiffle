export const resolveUrl = (
	url: URL | string,
	baseUrl?: URL | string
) => (
	baseUrl
		? new URL(url, String(baseUrl).replace(/\/?$/, '/')).href.replace(/\/?$/, '')
		: new URL(url).href
)
