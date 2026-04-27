#!/usr/bin/env node
/**
 * Runs https://github.com/farcasterxyz/snap (apps/emulator) for e2e tests.
 * Set FARCASTER_SNAP_REPO to a local clone; otherwise a shallow clone is created under
 * <repo>/.cache/farcaster-snap/ (add that path to FARCASTER_SNAP_REPO to reuse).
 */
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const skiffleRoot = join(__dirname, '..')
const defaultCache = join(skiffleRoot, '.cache', 'farcaster-snap')
const snapRepo = process.env.FARCASTER_SNAP_REPO?.trim() || defaultCache
const remote = process.env.FARCASTER_SNAP_GIT_URL?.trim()
	|| 'https://github.com/farcasterxyz/snap.git'
const pnpm = process.env.PNPM_BIN?.trim() || 'pnpm'

const tryCorepackEnable = () => {
	if (process.env.SKIP_PNPMPREP === '1') {
		return
	}
	try {
		execFileSync('corepack', ['enable'], { stdio: 'ignore' })
	} catch {
		// non-fatal if already enabled
	}
}

const ensureRepo = () => {
	if (existsSync(join(snapRepo, 'pnpm-workspace.yaml'))) {
		return
	}
	tryCorepackEnable()
	mkdirSync(dirname(snapRepo), { recursive: true })
	if (existsSync(snapRepo) && !existsSync(join(snapRepo, 'package.json'))) {
		rmSync(snapRepo, { recursive: true, force: true })
	}
	execFileSync('git', [
		'clone', '--depth', '1', remote, snapRepo,
	], { stdio: 'inherit' })
}

const run = () => {
	tryCorepackEnable()
	ensureRepo()
	if (!existsSync(join(snapRepo, 'node_modules'))) {
		execFileSync(
			pnpm,
			['install'],
			{ stdio: 'inherit', cwd: snapRepo, env: process.env },
		)
	}
	const em = spawn(
		pnpm,
		['--filter', '@farcaster/snap-emulator', 'dev'],
		{ cwd: snapRepo, stdio: 'inherit', env: { ...process.env } },
	)
	em.on('exit', (code) => {
		process.exit(code ?? 1)
	})
}

run()
