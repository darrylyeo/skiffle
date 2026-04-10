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
	bio: string,
	follower_count: number,
	following_count: number,
}

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
				pfp: { url: string },
				profile: { bio: { text: string } },
				followerCount: number,
				followingCount: number,
			},
		},
	}>(`/v2/user?fid=${fid}`)
		.then(({ result: { user } }) => (
			{
				fid: user.fid,
				username: user.username,
				display_name: user.displayName,
				pfp_url: user.pfp.url,
				bio: user.profile.bio?.text ?? '',
				follower_count: user.followerCount,
				following_count: user.followingCount,
			} satisfies DemoUser
		))
)

export type DemoCast = {
	content: string,
	timestamp: number,
}

export const getDemoCastsByFid = async ({
	fid,
	limit = 25,
}: {
	fid: number,
	limit?: number,
}) => (
	fcJson<{
		result: {
			casts: {
				text: string,
				timestamp: number,
			}[],
		},
	}>(`/v2/casts?fid=${fid}&limit=${limit}`)
		.then(({ result: { casts } }) => (
			{
				casts: casts.map((cast) => (
					{
						content: cast.text,
						timestamp: cast.timestamp,
					} satisfies DemoCast
				)),
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

export type DemoChannelCast = {
	hash: string,
	authorDisplayName: string,
	authorUsername: string,
	authorPfpUrl: string,
	content: string,
	reactionCount: number,
	recastCount: number,
	replyCount: number,
	timestamp: number,
}

const fallbackPopularChannels = [
	{
		id: 'base',
		key: 'base',
		name: 'Base',
		url: 'https://onchainsummer.xyz',
		description: 'Bringing the world onchain - a community of builders on Base',
		followerCount: 480695,
		memberCount: 813,
		imageUrl: '',
		headerImageUrl: '',
	},
	{
		id: 'ethereum',
		key: 'ethereum',
		name: 'Ethereum',
		url: 'https://ethereum.org',
		description: 'Discussions about Ethereum.',
		followerCount: 334197,
		memberCount: 3105,
		imageUrl: '',
		headerImageUrl: '',
	},
	{
		id: 'founders',
		key: 'founders',
		name: 'Founders',
		url: 'https://farcaster.group',
		description: 'A space for founders',
		followerCount: 234543,
		memberCount: 516,
		imageUrl: '',
		headerImageUrl: '',
	},
	{
		id: 'fc-updates',
		key: 'fc-updates',
		name: 'fc-updates',
		url: 'https://warpcast.com/~/channel/fc-updates',
		description: 'Important updates about things happening in Farcaster',
		followerCount: 140610,
		memberCount: 5,
		imageUrl: '',
		headerImageUrl: '',
	},
	{
		id: 'frames',
		key: 'frames',
		name: 'frames',
		url: 'https://warpcast.com/~/channel/frames',
		description: 'Discussion about Farcaster Frames.',
		followerCount: 101427,
		memberCount: 90,
		imageUrl: '',
		headerImageUrl: '',
	},
	{
		id: 'superrare',
		key: 'superrare',
		name: 'SuperRare',
		url: 'https://superrare.com',
		description: 'The culture exchange',
		followerCount: 96857,
		memberCount: 873,
		imageUrl: '',
		headerImageUrl: '',
	},
] satisfies DemoChannel[]

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
						description: channel.description,
						followerCount: channel.followerCount,
						memberCount: channel.memberCount,
						imageUrl: channel.imageUrl,
						headerImageUrl: channel.headerImageUrl ?? '',
						publicCasting: true,
					} satisfies DemoChannel
				))
				.filter((channel) => (
					channel.name.trim()
					&& channel.description.trim()
					&& isValidHttpUrl(channel.url)
				))
				.slice(0, 120)
		))
		.catch((error) => {
			console.error('popular channels fetch failed', error)
			return fallbackPopularChannels
		})
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
					authorDisplayName: cast.author.displayName,
					authorUsername: cast.author.username,
					authorPfpUrl: cast.author.pfp.url,
					content: cast.embeds?.processedCastText ?? cast.text,
					reactionCount: cast.reactions.count,
					recastCount: cast.recasts.count,
					replyCount: cast.replies.count,
					timestamp: cast.timestamp,
				} satisfies DemoChannelCast
			))
		))
)
