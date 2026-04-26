const decodeEntitiesForBadge = (value: string) => {
	let out = value
	for (let i = 0; i < 10 && out.includes('&amp;'); i++) {
		out = out.replaceAll('&amp;', '&')
	}

	return (
		out
			.replaceAll('&quot;', '"')
			.replaceAll('&lt;', '<')
			.replaceAll('&gt;', '>')
	)
}

export const footerUrlBadgeContent = (href: string) => {
	try {
		const u = new URL(href)
		const path = (
			u.pathname === '/' || u.pathname === ''
				? ''
				: u.pathname.replace(/\/$/, '')
		)

		return decodeEntitiesForBadge(
			`${u.host}${path}${u.search}${u.hash}`
				.replace(/%2f/gi, '/'),
		)
	} catch {
		return decodeEntitiesForBadge(
			href
				.replace(/^https?:\/\//i, '')
				.replace(/%2f/gi, '/')
				.replace(/\/+$/, ''),
		)
	}
}
