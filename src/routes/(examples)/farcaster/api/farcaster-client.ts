import type { DemoFarcasterCast } from '$/lib/farcaster-casts'

import { farcasterCastUrl } from '$/lib/farcaster-casts'

const baseUrl = 'https://api.farcaster.xyz'
const farcasterAppApiBaseUrl = 'https://farcaster.xyz/~api'

type FcErrorBody = {
	errors?: { message: string }[],
}

const fcJson = async <T>(
	pathWithQuery: string,
) => {
	const response = await fetch(`${baseUrl}${pathWithQuery}`)
	const body = (
		await response.json()
	) as T & FcErrorBody

	if (body.errors?.length)
		throw new Error(body.errors[0].message)

	if (!response.ok)
		throw new Error(`Farcaster API HTTP ${response.status}`)

	return body as T
}

const farcasterAppJson = async <T>(
	pathWithQuery: string,
) => {
	const response = await fetch(`${farcasterAppApiBaseUrl}${pathWithQuery}`)
	const body = (
		await response.json()
	) as T & FcErrorBody

	if (body.errors?.length)
		throw new Error(body.errors[0].message)

	if (!response.ok)
		throw new Error(`Farcaster app API HTTP ${response.status}`)

	return body as T
}

export type DemoUser = {
	fid: number,
	username: string,
	display_name: string,
	pfp_url: string,
	pfp_verified: boolean,
	bio: string,
	follower_count: number,
	following_count: number,
	profile_url: string,
	account_level: string,
	early_wallet_adopter: boolean,
	connected_account_count: number,
	eth_wallet_count: number,
	solana_wallet_count: number,
	custody_address_short: string,
	collections_owned_count: number,
	neynar_score?: number,
}

const shortHexAddress = (addr: string) => (
	addr.length > 12
		? `${addr.slice(0, 6)}...${addr.slice(-4)}`
		: addr
)

export const getDemoUserByFid = async ({
	fid,
}: {
	fid: number,
}) => (
	fcJson<{
		result: {
			user: {
				fid: number,
				username: string,
				displayName: string,
				pfp: { url: string, verified?: boolean },
				profile: {
					bio?: { text?: string },
					url?: string,
					accountLevel?: string,
					earlyWalletAdopter?: boolean,
				},
				followerCount: number,
				followingCount: number,
				connectedAccounts?: unknown[],
				collectionsOwned?: unknown[],
				score?: number,
				experimental?: {
					neynar_user_score?: number,
				},
				extras?: {
					custodyAddress?: string,
					ethWallets?: unknown[],
					solanaWallets?: unknown[],
					publicSpamLabel?: string,
				},
			},
		},
	}>(`/v2/user?fid=${fid}`)
		.then(({ result: { user } }) => {
			const custody = user.extras?.custodyAddress ?? ''
			const publicSpamScore = Number(
				(
					user.extras?.publicSpamLabel
						?.match(/^\s*(-?\d+(?:\.\d+)?)/)
						?.[1]
				)
				?? Number.NaN
			)
			return {
				fid: user.fid,
				username: user.username,
				display_name: user.displayName,
				pfp_url: user.pfp.url,
				pfp_verified: user.pfp.verified ?? false,
				bio: user.profile.bio?.text ?? '',
				follower_count: user.followerCount,
				following_count: user.followingCount,
				profile_url: user.profile.url,
				account_level: user.profile.accountLevel ?? '',
				early_wallet_adopter: user.profile.earlyWalletAdopter ?? false,
				connected_account_count: user.connectedAccounts?.length ?? 0,
				eth_wallet_count: user.extras?.ethWallets?.length ?? 0,
				solana_wallet_count: user.extras?.solanaWallets?.length ?? 0,
				custody_address_short: custody ? shortHexAddress(custody) : '',
				collections_owned_count: user.collectionsOwned?.length ?? 0,
				neynar_score: (
					typeof user.experimental?.neynar_user_score === 'number'
						? user.experimental.neynar_user_score
					: typeof user.score === 'number'
						? user.score
					: Number.isFinite(publicSpamScore)
						? publicSpamScore
					:
						undefined
				),
			} satisfies DemoUser
		})
)

export const getDemoCastsByFid = async ({
	fid,
	limit = 25,
	cursor,
}: {
	fid: number,
	limit?: number,
	cursor?: string,
}) => (
	fcJson<{
		result: {
			casts: {
				hash: string,
				author: {
					displayName: string,
					username: string,
					pfp: { url: string },
				},
				reactions: {
					count: number,
				},
				recasts: {
					count: number,
				},
				replies: {
					count: number,
				},
				text: string,
				timestamp: number,
			}[],
		},
		next?: {
			cursor?: string,
		},
	}>(
		`/v2/casts?fid=${fid}&limit=${limit}${
			cursor
				? `&cursor=${encodeURIComponent(cursor)}`
				: ''
		}`,
	)
		.then((body) => (
			{
				casts: body.result.casts.map((cast) => (
					{
						hash: cast.hash,
						url: farcasterCastUrl(cast.author.username, cast.hash),
						authorDisplayName: cast.author.displayName,
						authorUsername: cast.author.username,
						authorPfpUrl: cast.author.pfp.url,
						content: cast.text,
						reactionCount: cast.reactions.count,
						recastCount: cast.recasts.count,
						replyCount: cast.replies.count,
						timestamp: cast.timestamp,
					} satisfies DemoFarcasterCast
				)),
				nextCursor: (
					typeof body.next?.cursor === 'string' && body.next.cursor.trim()
						? body.next.cursor
						: undefined
				),
			}
		))
)

export type DemoChannel = {
	id: string,
	key: string,
	name: string,
	url: string,
	description: string,
	followerCount: number,
	memberCount: number,
	imageUrl: string,
	headerImageUrl: string,
	publicCasting?: boolean,
	castingMode?: string,
	lead?: DemoChannelLead,
}

export type DemoChannelLead = {
	fid: number,
	displayName: string,
	username: string,
	pfpUrl: string,
	bio: string,
}

export const isValidHttpUrl = (href: string) => {
	try {
		const u = new URL(href)
		return u.protocol === 'https:' || u.protocol === 'http:'
	} catch {
		return false
	}
}

export const getPopularChannels = async () => (
	fcJson<{
		result: {
			channels: {
				id: string,
				name: string,
				url: string,
				description: string,
				followerCount: number,
				memberCount: number,
				imageUrl: string,
				headerImageUrl?: string,
				publicCasting?: boolean,
			}[],
		},
	}>('/v2/all-channels')
		.then(({ result: { channels } }) => (
			[...channels]
				.sort((a, b) => b.followerCount - a.followerCount)
				.map((channel) => (
					{
						id: channel.id,
						key: channel.id,
						name: channel.name,
						url: channel.url,
						description: channel.description ?? '',
						followerCount: channel.followerCount,
						memberCount: channel.memberCount,
						imageUrl: channel.imageUrl ?? '',
						headerImageUrl: channel.headerImageUrl ?? '',
						publicCasting: channel.publicCasting ?? true,
					} satisfies DemoChannel
				))
				.filter((channel) => (
					channel.name.trim()
					&& isValidHttpUrl(channel.url)
				))
				.slice(0, 120)
		))
)

export const getDemoChannelById = async ({
	channelId,
}: {
	channelId: string,
}) => {
	const [channelResponse, detailResponse] = await Promise.all([
		fcJson<{
			result: {
				channel: {
					key: string,
					name: string,
					description: string,
					imageUrl: string,
					headerImageUrl?: string,
					followerCount: number,
					memberCount: number,
					publicCasting: boolean,
					castingMode: string,
				},
			},
		}>(`/v2/channel?key=${encodeURIComponent(channelId)}`),
		farcasterAppJson<{
			result: {
				details?: {
					lead?: {
						fid: number,
						displayName: string,
						username: string,
						pfp?: { url?: string },
						profile?: {
							bio?: { text?: string },
						},
					},
				},
			},
		}>(`/v1/channel-details?key=${encodeURIComponent(channelId)}`)
			.catch(() => (
				{
					result: {},
				}
			)),
	])

	const channel = channelResponse.result.channel
	const lead = detailResponse.result.details?.lead

	return {
		id: channel.key,
		key: channel.key,
		name: channel.name,
		url: `https://farcaster.xyz/~/channel/${channel.key}`,
		description: channel.description,
		followerCount: channel.followerCount,
		memberCount: channel.memberCount,
		imageUrl: channel.imageUrl,
		headerImageUrl: channel.headerImageUrl ?? '',
		publicCasting: channel.publicCasting,
		castingMode: channel.castingMode,
		lead: (
			lead
				? {
					fid: lead.fid,
					displayName: lead.displayName,
					username: lead.username,
					pfpUrl: lead.pfp?.url ?? '',
					bio: lead.profile?.bio?.text ?? '',
				}
				: undefined
		),
	} satisfies DemoChannel
}

export const getDemoChannelCasts = async ({
	channelId,
}: {
	channelId: string,
}) => (
	farcasterAppJson<{
		result: {
			items: {
				cast: {
					hash: string,
					author: {
						displayName: string,
						username: string,
						pfp: { url: string },
					},
					embeds?: {
						processedCastText?: string,
					},
					reactions: {
						count: number,
					},
					recasts: {
						count: number,
					},
					replies: {
						count: number,
					},
					text: string,
					timestamp: number,
				},
			}[],
		},
	}>(`/v2/og-feed-items?feedKey=${encodeURIComponent(channelId)}`)
		.then(({ result: { items } }) => (
			items.map(({ cast }) => (
				{
					hash: cast.hash,
					url: farcasterCastUrl(cast.author.username, cast.hash),
					authorDisplayName: cast.author.displayName,
					authorUsername: cast.author.username,
					authorPfpUrl: cast.author.pfp.url,
					content: cast.embeds?.processedCastText ?? cast.text,
					reactionCount: cast.reactions.count,
					recastCount: cast.recasts.count,
					replyCount: cast.replies.count,
					timestamp: cast.timestamp,
				} satisfies DemoFarcasterCast
			))
		))
)
