import { resolve } from '$app/paths'

export const DEMOS_SNAP_PAGE_SIZE = 4

const rows = [
	{
		key: 'profile',
		label: '👤 My Profile',
		open: (fid: string) => resolve('/(examples)/farcaster/user/[farcasterUserId]', { farcasterUserId: fid }),
	},
	{ key: 'channels', label: '📻 Channels', open: '/farcaster/channels?/open' },
	{ key: 'tips', label: '📽️ Slideshow', open: '/demos/tips?/open' },
	{ key: 'art', label: '🎨 Generative Art', open: '/art?/open' },
	{ key: 'counter', label: '🔢 Counter', open: '/demos/counter?/open' },
	{ key: 'coin-flip', label: '🪙 Coin Flip', open: '/demos/coin-flip?/open' },
	{ key: 'rock-paper-scissors', label: '✂️ Rock Paper Scissors', open: '/demos/rock-paper-scissors?/open' },
	{ key: 'tic-tac-toe', label: '❎ Tic-tac-toe', open: '/demos/tic-tac-toe?/open' },
	{ key: 'hangman', label: '🔠 Hangman', open: '/demos/hangman?/open' },
	{ key: 'wordle', label: '🟩 Wordle', open: '/demos/wordle?/open' },
]

export const demosFrameButtons = (farcasterUserId: string | number) => {
	const fid = String(farcasterUserId)
	return rows.map((r) => ({
		label: r.label,
		action: 'post' as const,
		targetUrl: typeof r.open === 'function' ? r.open(fid) : r.open,
	}))
}

export const demosBackUrl = (key: string) => {
	const i = rows.findIndex((r) => r.key === key)
	return `/?/demos&page=${String(Math.floor((i < 0 ? 0 : i) / DEMOS_SNAP_PAGE_SIZE))}`
}
