export type DemoFarcasterCast = {
	hash: string
	url: string
	authorDisplayName: string
	authorUsername: string
	authorPfpUrl: string
	content: string
	reactionCount: number
	recastCount: number
	replyCount: number
	timestamp: number
}

export const farcasterCastUrl = (
	authorUsername: string,
	hash: string,
) => (
	`https://farcaster.xyz/${encodeURIComponent(authorUsername)}/${encodeURIComponent(hash)}`
)

export const farcasterCastContent = (
	content: string,
	maxLength = 220,
) => (
	content
		.replaceAll(/\s+/g, ' ')
		.trim()
		.slice(0, maxLength)
)

export const farcasterCastDate = (timestamp: number) => (
	new Date(timestamp).toLocaleString()
)

export const farcasterInitials = (
	label: string,
	fallback: string,
) => {
	const value = (label.trim() || fallback.trim()).replace(/^@/, '')
	const words = value.split(/\s+/).filter(Boolean)

	return (
		words.length >= 2 ?
			`${words[0][0] ?? ''}${words.at(-1)?.[0] ?? ''}`
		:
			value.slice(0, 2)
	).toUpperCase()
}
