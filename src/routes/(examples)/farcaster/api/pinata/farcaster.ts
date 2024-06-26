import { env } from '$env/dynamic/private'

/**
 * Pinata - Farcaster API (2024-05-03)
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/getting-started}
 */
const get = async <T>(
	endpoint: string,
	params?: Record<string, string | number | boolean | undefined>,
) => {
	const searchParams = params && new URLSearchParams(
		Object.entries(params as Record<string, string>)
			.filter(([, value]) => value !== undefined)
	)

	const response = await (
		fetch(`https://api.pinata.cloud/v3/farcaster/${endpoint}${searchParams ? `?${searchParams}` : ''}`, {
			headers: {
				'Authorization': `Bearer ${env.PINATA_JWT}`,
			},
		})
	)

	if(!response.ok)
		throw await response.json()

	return await response.json() as T
}


// Types
type integer = number

type Cast = {
	author: {
		bio: string,
		custody_address: string,
		display_name: string,
		fid: number,
		follower_count: number,
		following_count: number,
		pfp_url: string,
		recovery_address: string,
		uid: number,
		username: string,
		verifications: string[],
	},
	content: string,
	embeds: {
		url: string,
	}[],
	fid: number,
	hash: string,
	mentioned_profiles: string[],
	reactions: {
		likes: {
			fid: number,
			fname: string,
		}[],
		recasts: {
			fid: number,
			fname: string,
		}[],
	},
	replies: {
		count: number,
	},
	root_parent_url: string,
	short_hash: string,
	timestamp: string,
}

type Channel = {
	created_at: number,
	description: string,
	display_name: string,
	image_url: string,
	lead_fid: number,
	name: string,
	url: string,
}

type User = {
	bio: string,
	custody_address: string,
	display_name: string,
	fid: number,
	follower_count: number,
	following_count: number,
	pfp_url: string,
	recovery_address: string,
	username: string,
	verifications: string[],
}

type CastAddBody = {
	text: string,
	parent_url: string,
	embeds: Embed[],
	mentions: number[],
	mention_positions: number[],
	parent_cast_id: CastId,
}

type Embed = {
	url: string,
	castId: CastId,
}

type CastId = {
	fid: number,
	hash: string,
}

enum CastType {
	MESSAGE_TYPE_CAST_ADD = 'MESSAGE_TYPE_CAST_ADD',
	MESSAGE_TYPE_CAST_REMOVE = 'MESSAGE_TYPE_CAST_REMOVE',
	MESSAGE_TYPE_REACTION_ADD = 'MESSAGE_TYPE_REACTION_ADD',
	MESSAGE_TYPE_REACTION_REMOVE = 'MESSAGE_TYPE_REACTION_REMOVE',
	MESSAGE_TYPE_LINK_ADD = 'MESSAGE_TYPE_LINK_ADD',
	MESSAGE_TYPE_LINK_REMOVE = 'MESSAGE_TYPE_LINK_REMOVE',
}

type Network = 'FARCASTER_NETWORK_MAINNET' | 'FARCASTER_NETWORK_TESTNET'

type HashScheme = 'HASH_SCHEME_BLAKE3'

type SignatureScheme = 'SIGNATURE_SCHEME_ED25519'

type ReactionType = 'like' | 'recast'



/**
 * Farcaster API
 */


/**
 * Cast by Hash
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/cast-by-hash}
 */
export const getCastByHash = async ({
	hash,
}: {
	/**
	 * The full hash of the cast you want to fetch
	 */
	hash: string,
}) => get<{
	data: Cast,
}>(`casts/${hash}`)


/**
 * Casts
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/casts}
 * 
 * This endpoint is great for fetching a particular cast or by combining with query parameters to get specific lists of casts.
 * 
 * Casts by FID
 * `/casts?fid=6023`
 * Returns all the casts from user FID `6023`
 * 
 * Casts by Following
 * `/casts?fid=6023&following=true`
 * Returns all the casts from users that FID `6023` is following
 * 
 * Casts by Channel
 * `/casts?channel=https://warpcast.com/~/channel/pinata`
 * Returns all the casts from a specific channel, e.g. `https://warpcast.com/~/channel/pinata`
 * 
 * Casts by Parent Hash
 * Returns all the casts fror a specified parent hash
 * `/casts?parentHash=0x0ab851ba8524eedf9e164b55f6eeec751f74b539`
 */
export const getCasts = async ({
	fid,
	following,
	channel,
	parentHash,
	pageSize = 100,
	pageToken,
}: {
	/**
	 * Returns casts from a specific FID
	 */
	fid?: integer,

	/**
	 * When used in combination of `fid` will return the casts for who that `fid` is following
	 */
	following?: boolean,

	/**
	 * Specify a channel to fetch casts from
	 */
	channel?: string,

	/**
	 * Returns casts for a specific parent hash
	 */
	parentHash?: string,

	/**
	 * Determine the number of results, if not specified default is 100
	 */
	pageSize?: integer,

	/**
	 * Token to be used for the next page of results
	 */
	pageToken?: string,
}) => get<{
	data: {
		casts: Cast[],
		next_page_token: string,
	},
}>(`casts`, {
	fid,
	following,
	channel,
	parentHash,
	pageSize,
	pageToken,
})


/**
 * Send Cast
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/send-cast}
 */
export const sendCast = async ({
	castAddBody,
	signerId,
}: {
	/**
	 * The body of sending a cast is made up of primarily two pieces. One is the `signerId` provided by using [Farcaster Auth](https://docs.pinata.cloud/farcaster/farcaster-auth). The other is the `castAddBody` object which follows the same pattern of Farcaster Hubs when submitting a cast.
	 */
	castAddBody: CastAddBody,

	/**
	 * The signerId of the user sending a cast, already approved via Farcaster Auth
	 */
	signerId: string,
}) => get<{
	data: {
		data: {
			type: CastType.MESSAGE_TYPE_CAST_ADD,
			fid: number,
			timestamp: number,
			network: Network,
			castAddBody: CastAddBody,
		},
		hash: string,
		hashScheme: HashScheme,
		signature: string,
		signatureScheme: SignatureScheme,
		signer: string,
		dataBytes: string,
	},
}>(`casts`, {
	castAddBody: JSON.stringify(castAddBody),
	signerId,
})


/**
 * Delete Cast
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/delete-cast}
 */
export const deleteCast = async ({
	hash,
	signerId,
}: {
	/**
	 * Hash for the cast to be deleted
	 */
	hash: string,

	/**
	 * Signer ID for the author of the cast
	 */
	signerId: string,
}) => get<{
	data: {
		data: {
			type: CastType.MESSAGE_TYPE_CAST_REMOVE,
			fid: number,
			timestamp: number,
			network: Network,
			castAddBody: CastAddBody,
		},
		hash: string,
		hashScheme: HashScheme,
		signature: string,
		signatureScheme: SignatureScheme,
		signer: string,
		dataBytes: string,
	},
}>(`casts/${hash}`, {
	signerId,
})


/**
 * Add Reaction to Cast
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/add-reaction-to-cast}
 */
export const addReactionToCast = async ({
	hash,
	type,
	signerId,
}: {
	/**
	 * Hash for the cast to be deleted
	 */
	hash: string,

	/**
	 * The type of reaction, can be either "like" or "recast"
	 */
	type: ReactionType,

	/**
	 * Signer ID for the user that will react to the cast
	 */
	signerId: string,
}) => get<{
	data: {
		data: {
			type: CastType.MESSAGE_TYPE_REACTION_ADD,
			fid: number,
			timestamp: number,
			network: Network,
			castAddBody: {
				embedsDeprecated: null,
				mentions: null,
			},
		},
		hash: string,
		hashScheme: HashScheme,
		signature: string,
		signatureScheme: SignatureScheme,
		signer: string,
		dataBytes: string,
	},
}>(`casts/${hash}/reactions/${type}`, {
	signerId,
})


/**
 * Delete Reaction to Cast
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/delete-reaction-to-cast}
 */
export const deleteReactionToCast = async ({
	hash,
	type,
	signerId,
}: {
	/**
	 * Hash for the target cast
	 */
	hash: string,

	/**
	 * The type of reaction, can be either "like" or "recast"
	 */
	type: ReactionType,

	/**
	 * Signer ID for the user that will remove reaction to the cast
	 */
	signerId: string,
}) => get<{
	data: {
		data: {
			type: CastType.MESSAGE_TYPE_REACTION_REMOVE,
			fid: number,
			timestamp: number,
			network: Network,
			castAddBody: {
				embedsDeprecated: null,
				mentions: null,
			},
		},
		hash: string,
		hashScheme: HashScheme,
		signature: string,
		signatureScheme: SignatureScheme,
		signer: string,
		dataBytes: string,
	},
}>(`casts/${hash}/reactions/${type}`, {
	signerId,
})


/**
 * Channels List
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/channels-list}
 */
export const getChannels = async ({
	pageSize = 100,
	pageToken,
}: {
	/**
	 * Determine the number of results, if not specified default is 100
	 */
	pageSize?: integer,

	/**
	 * Token to be used for the next page of results
	 */
	pageToken?: string,
}) => get<{
	data: {
		channels: Channel[],
		next_page_token: string,
	},
}>(`channels`, {
	pageSize,
	pageToken,
})


/**
 * Channel By Name
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/channel-by-name}
 */
export const getChannelByName = async ({
	name,
}: {
	/**
	 * Display name for the channel you are trying to fetch
	 */
	name: string,
}) => get<{
	data: Channel,
}>(`channels/${name}`)


/**
 * Follow FID
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/follow-fid}
 */
export const followFID = async ({
	fid,
	signerId,
}: {
	/**
	 * Target FID to follow
	 */
	fid: number,

	/**
	 * Signer ID for the user following the target FID
	 */
	signerId: string,
}) => get<{
	data: {
		data: {
			type: CastType.MESSAGE_TYPE_LINK_ADD,
			fid: number,
			timestamp: number,
			network: Network,
		},
		hash: string,
		hashScheme: HashScheme,
		signature: string,
		signatureScheme: SignatureScheme,
		signer: string,
		dataBytes: string,
	},
}>(`follow/${fid}`, {
	signerId,
})


/**
 * Unfollow FID
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/unfollow-fid}
 */
export const unfollowFID = async ({
	fid,
	signerId,
}: {
	/**
	 * Target FID to unfollow
	 */
	fid: number,

	/**
	 * Signer ID for the user unfollowing the target FID
	 */
	signerId: string,
}) => get<{
	data: {
		data: {
			type: CastType.MESSAGE_TYPE_LINK_REMOVE,
			fid: number,
			timestamp: number,
			network: Network,
		},
		hash: string,
		hashScheme: HashScheme,
		signature: string,
		signatureScheme: SignatureScheme,
		signer: string,
		dataBytes: string,
	},
}>(`follow/${fid}`, {
	signerId,
})


/**
 * User By FID
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/user-by-fid}
 */
export const getUserByFID = async ({
	fid,
}: {
	/**
	 * FID for the user you are trying to fetch
	 */
	fid: integer,
}) => get<{
	data: User,
}>(`users/${fid}`)


/**
 * Users
 * {@link https://docs.pinata.cloud/farcaster/farcaster-api/endpoint/users}
 * 
 * This endpoint is similar to `/casts` in that you can either fetch a specific user by FID or you can combine multiple query parameters to get specific lists of users.
 * 
 * Users Following FID
 * `/users?fid=6023&followers=true`
 * Returns all the users following a specific FID
 * 
 * Users FID Following
 * `/users?fid=6023&following=true`
 * Returns all the users a specific FID is following
 */
export const getUsers = async ({
	fid,
	followers,
	following,
	pageSize = 100,
	pageToken,
}: {
	/**
	 * Returns the user with the specified FID
	 */
	fid?: integer,

	/**
	 * When used with `fid` will return the followers of the specified `fid`
	 */
	followers?: boolean,

	/**
	 * When used with `fid` will return the users `fid` is following
	 */
	following?: boolean,

	/**
	 * Determine the number of results, if not specified default is 100
	 */
	pageSize?: integer,

	/**
	 * Token to be used for the next page of results
	 */
	pageToken?: string,
}) => get<{
	data: {
		users: User[],
		next_page_token: string,
	},
}>(`users`, {
	fid,
	followers,
	following,
	pageSize,
	pageToken,
})
