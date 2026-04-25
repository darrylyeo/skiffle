const trimHeaderToken = (value: string) => (
	value
		.trim()
		.replace(/^"|"$/g, '')
)

const firstHeaderValue = (
	headers: Headers,
	name: string,
) => {
	const value = headers.get(name)
	return value
		? trimHeaderToken(value.split(',')[0] ?? '')
		: undefined
}

const forwardedParams = (headers: Headers) => {
	const raw = headers.get('forwarded')
	if (!raw) {
		return {}
	}

	const firstEntry = raw.split(',')[0] ?? ''
	const params: Record<string, string> = {}

	for (const part of firstEntry.split(';')) {
		const [rawKey, ...rawValue] = part.split('=')
		if (!rawKey || rawValue.length === 0) {
			continue
		}

		params[rawKey.trim().toLowerCase()] = trimHeaderToken(rawValue.join('='))
	}

	return params
}

const applyPort = (
	host: string,
	port: string | undefined,
	protocol: string,
) => {
	if (!port || host.includes(':')) {
		return host
	}

	if (
		(protocol === 'https:' && port === '443')
		|| (protocol === 'http:' && port === '80')
	) {
		return host
	}

	return `${host}:${port}`
}

export const publicRequestUrl = (
	requestUrl: URL | string,
	headers: Headers,
) => {
	const current = new URL(String(requestUrl))
	const configuredBase = process.env.SNAP_PUBLIC_BASE_URL?.trim()

	if (configuredBase) {
		const external = new URL(configuredBase)
		return new URL(
			`${current.pathname}${current.search}${current.hash}`,
			external.origin,
		)
	}

	const forwarded = forwardedParams(headers)
	const protocol = (() => {
		const forwardedProto = firstHeaderValue(headers, 'x-forwarded-proto') ?? forwarded.proto
		if (!forwardedProto) {
			return current.protocol
		}
		return forwardedProto.endsWith(':')
			? forwardedProto
			: `${forwardedProto}:`
	})()
	const host = applyPort(
		firstHeaderValue(headers, 'x-forwarded-host')
			?? forwarded.host
			?? firstHeaderValue(headers, 'host')
			?? current.host,
		firstHeaderValue(headers, 'x-forwarded-port'),
		protocol,
	)

	if (host === current.host && protocol === current.protocol) {
		return current
	}

	return new URL(
		`${current.pathname}${current.search}${current.hash}`,
		`${protocol}//${host}`,
	)
}
