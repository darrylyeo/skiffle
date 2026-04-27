import { expect, test, type APIRequestContext } from '@playwright/test'

const skiffle = 'http://127.0.0.1:4173'

const snapPaths = [
	'/',
	'/about',
	'/demos/counter',
	'/demos/coin-flip',
	'/art',
	'/demos/rock-paper-scissors',
	'/demos/tic-tac-toe',
	'/demos/hangman',
	'/demos/wordle',
	'/demos/tips',
	'/farcaster/channels',
	'/farcaster/channels/channel/farcaster',
	'/farcaster/user/1',
	'/farcaster/user/1/casts',
] as const

const collectStringUrls = (
	value: unknown,
	acc: Set<string>,
) => {
	if (typeof value === 'string') {
		if (value.startsWith('http://') || value.startsWith('https://')) {
			acc.add(value)
		}
	} else if (value && typeof value === 'object') {
		if (Array.isArray(value)) {
			for (const m of value) {
				collectStringUrls(
					m,
					acc,
				)
			}
		} else {
			for (const m of Object.values(value)) {
				collectStringUrls(
					m,
					acc,
				)
			}
		}
	}
}

const expectEmulatorGetSnap = async (
	request: APIRequestContext,
	emulatorOrigin: string,
) => {
	for (const path of snapPaths) {
		const u = new URL(
			path,
			skiffle,
		).toString()
		const hit = await request.get(
			`${emulatorOrigin}/api/snap?url=${encodeURIComponent(u)}`,
		)
		const body = (await hit.text())
			.slice(0, 500)
		expect
			.soft(
				hit.status(),
				`[${path}] /api/snap: ${body}`,
			)
			.toBe(200)
		if (!hit.ok()) {
			continue
		}
		const b = (await hit.json().catch(
			() => ({}),
		)) as { snap?: unknown }
		expect
			.soft('snap' in b && b.snap, `[${path}] no snap in ${JSON.stringify(b).slice(0, 400)}`)
			.toBeTruthy()
	}
}

test.describe.configure({ mode: 'serial' })

test('emulator GET /api/snap for every skiffle path returns snap (proxy check)', async (
	{ baseURL, request: req },
) => {
	const o = (baseURL ?? 'http://127.0.0.1:3000').replace(/\/$/, '')
	test.setTimeout(1_200_000)
	await expectEmulatorGetSnap(
		req,
		o,
	)
})

test('snap JSON from emulator yields skiffle frame / png URLs that respond', async (
	{ baseURL, request: req },
) => {
	const o = (baseURL ?? 'http://127.0.0.1:3000').replace(/\/$/, '')
	for (const path of snapPaths) {
		const u = new URL(
			path,
			skiffle,
		).toString()
		const r = await req.get(
			`${o}/api/snap?url=${encodeURIComponent(u)}`,
		)
		if (!r.ok()) {
			continue
		}
		const b = (await r.json()) as { snap?: unknown }
		const s = b.snap
		if (s == null) {
			continue
		}
		const out = new Set<string>()
		collectStringUrls(
			s,
			out,
		)
		/** Satori → png can be slow; default APIRequest timeout (30s) is too tight */
		const getOpts = { timeout: 180_000, maxRedirects: 5 }
		for (const h of out) {
			if (!/127\.0\.0\.1:4173/.test(h) || !(/\.png|frameImage=/.test(h)))
				{ continue }
			const p = await req.get(
				h,
				{
					...getOpts,
					headers: { accept: 'image/png,image/*,*/*' },
				},
			)
			expect
				.soft(
					p.status(),
					`[${path}] ${h}`,
				)
				.toBe(200)
		}
	}
})

test('emulator /emulator (browser) opens the snap URL form', async (
	{ page, baseURL },
) => {
	test.setTimeout(120_000)
	const o = (baseURL ?? 'http://127.0.0.1:3000').replace(/\/$/, '')
	await page.goto(
		`${o}/emulator`,
		{ waitUntil: 'load' },
	)
	await expect(page.getByText('Snap URL', { exact: true }))
		.toBeVisible(
			{ timeout: 20_000 },
		)
	await expect(page.getByText('Load a snap URL to render it here.', { exact: true }))
		.toBeVisible()
})
