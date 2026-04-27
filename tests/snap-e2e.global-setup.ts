import type { FullConfig } from '@playwright/test'

const globalSetup = async (
	_config: FullConfig,
) => {
	// globalSetup runs before any webServer / browser: explain why the window is late
	const lines = [
		'',
		'── Snap e2e ──',
		'Chromium (headed) opens only after BOTH servers are up: Skiffle preview (4173) and the',
		'Farcaster snap repo emulator (3000, see https://github.com/farcasterxyz/snap, apps/emulator).',
		'First time: git clone + pnpm install + @farcaster/snap prebuild in that monorepo can take many minutes; keep this terminal in view (stdio is inherited in playwright-snap-e2e.config).',
		'Faster: run the emulator in another window first, then: CI=0 pnpm exec playwright test -c playwright-snap-e2e.config.ts (reuse on :3000).',
		'',
	]
	process.stdout.write(
		`${lines.join('\n')}\n`,
	)
}

export default globalSetup
