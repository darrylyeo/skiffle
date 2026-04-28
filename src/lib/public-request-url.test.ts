import { describe, expect, it } from 'vitest'

import { publicRequestUrl } from './public-request-url'

describe('publicRequestUrl', () => {
	it('uses forwarded host and proto for proxied requests', () => {
		const url = publicRequestUrl(
			'http://127.0.0.1:5173/demos/coin-flip',
			new Headers({
				host: '127.0.0.1:5173',
				'x-forwarded-host': 'snap.skiffle.dev',
				'x-forwarded-proto': 'https',
			}),
		)

		expect(url.href).toBe('https://snap.skiffle.dev/demos/coin-flip')
	})

	it('parses the standard Forwarded header', () => {
		const url = publicRequestUrl(
			'http://localhost:5173/?page=2',
			new Headers({
				forwarded: 'for=127.0.0.1;proto=https;host=snap.skiffle.dev',
			}),
		)

		expect(url.href).toBe('https://snap.skiffle.dev/?page=2')
	})

	it('prefers SNAP_PUBLIC_BASE_URL when configured', () => {
		const original = process.env.SNAP_PUBLIC_BASE_URL
		process.env.SNAP_PUBLIC_BASE_URL = 'https://snap.skiffle.dev'

		try {
			const url = publicRequestUrl(
				'http://localhost:5173/demos/tips',
				new Headers(),
			)

			expect(url.href).toBe('https://snap.skiffle.dev/demos/tips')
		} finally {
			if (original === undefined) {
				delete process.env.SNAP_PUBLIC_BASE_URL
			} else {
				process.env.SNAP_PUBLIC_BASE_URL = original
			}
		}
	})
})
