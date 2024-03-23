export const resolveUrl = (
	url: URL | string,
	baseUrl?: URL | string
) => (
	baseUrl
		? new URL(url, baseUrl).href
		: new URL(url).href
)
