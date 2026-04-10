import { error } from '@sveltejs/kit'

import { getDemoChannelById, getDemoChannelCasts } from '../../../api/farcaster-client'
import { buildChannelFrame, buildChannelSnap } from './channel-frame'
import type { Actions, PageServerLoad } from './$types'

const loadChannelData = async (channelId: string) => {
	try {
		const [channel, casts] = await Promise.all([
			getDemoChannelById({
				channelId,
			}),
			getDemoChannelCasts({
				channelId,
			}),
		])

		return {
			casts,
			channel,
		}
	} catch (cause) {
		console.error('channel demo load failed', cause)
		throw error(404, `Channel not found: ${channelId}`)
	}
}

export const load: PageServerLoad = async ({
	params: { channelId },
}) => (
	loadChannelData(channelId)
)

const frameAction = async ({
	params: { channelId },
	url,
}: {
	params: {
		channelId: string,
	},
	url: URL,
}) => {
	const data = await loadChannelData(channelId)

	return {
		...data,
		frame: buildChannelFrame(data.channel, data.casts, url),
		snap: buildChannelSnap(data.channel, data.casts, url),
	}
}

export const actions: Actions = {
	open: frameAction,
	paginate: frameAction,
}
