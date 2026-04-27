import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	/** CWD = repo root when `pnpm exec playwright` runs from skiffle */
	globalSetup: './tests/snap-e2e.global-setup.ts',
	testDir: 'tests',
	testMatch: /snap-emulator\.spec\.[jt]s/,
	fullyParallel: true,
	workers: 1,
	timeout: 90_000,
	maxFailures: 3,
	webServer: [
		{
			command: 'npm run build && npm run preview -- --host 127.0.0.1',
			cwd: process.cwd(),
			port: 4173,
			reuseExistingServer: !process.env['CI'],
			/** so you can see Vite / preview; very verbose */
			stdout: 'inherit',
			stderr: 'inherit',
		},
		{
			command: 'node ./scripts/run-farcaster-snap-emulator.mjs',
			cwd: process.cwd(),
			/**
			 * The emulator (Next) opens after `pnpm run dev` finishes workspace builds;
			 * first run after clone can take a long time.
			 */
			timeout: 1_200_000,
			reuseExistingServer: !process.env['CI'],
			/**
			 * emulator `/` redirects to `/emulator` — a 30x is enough for the server
			 * to be considered "up" (Playwright will follow; any 2xx/3xx counts).
			 */
			url: 'http://127.0.0.1:3000',
			stdout: 'inherit',
			stderr: 'inherit',
		},
	],
	use: {
		baseURL: 'http://127.0.0.1:3000',
		trace: 'on-first-retry',
	},
}

export default config
