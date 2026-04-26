export const footerUrlBadgeContent = (href: string) => {
	try {
		const u = new URL(href)
		const path = (
			u.pathname === '/' || u.pathname === ''
				? ''
				: u.pathname.replace(/\/$/, '')
		)

		return (
			`${u.host}${path}${u.search}${u.hash}`
				.replace(/%2f/gi, '/')
		)
	} catch {
		return (
			href
				.replace(/^https?:\/\//i, '')
				.replace(/%2f/gi, '/')
				.replace(/\/+$/, '')
		)
	}
}
