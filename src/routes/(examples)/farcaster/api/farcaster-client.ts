const baseUrl = 'https://api.farcaster.xyz'

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
	name: string,
	url: string,
	description: string,
	followerCount: number,
	memberCount: number,
	imageUrl: string,
}

const isValidHttpUrl = (href: string) => {
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
			}[],
		},
	}>('/v2/all-channels')
		.then(({ result: { channels } }) => (
			[...channels]
				.sort((a, b) => b.followerCount - a.followerCount)
				.map((channel) => (
					{
						id: channel.id,
						name: channel.name,
						url: channel.url,
						description: channel.description,
						followerCount: channel.followerCount,
						memberCount: channel.memberCount,
						imageUrl: channel.imageUrl,
					} satisfies DemoChannel
				))
				.filter((channel) => isValidHttpUrl(channel.url))
				.slice(0, 30)
		))
)
