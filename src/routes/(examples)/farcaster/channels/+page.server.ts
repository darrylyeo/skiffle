import { getPopularChannels } from '../api/farcaster-client'
import { buildChannelsFrame, buildChannelsSnap } from './channels-frame'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	try {
		const channels = await getPopularChannels()

		return {
			channels,
		}
	} catch (error) {
		console.error('popular channels load failed', error)
		return {
			channels: [],
		}
	}
}

const frameAction = async ({
	url,
}: {
	url: URL,
}) => {
	const channels = await getPopularChannels()

	return {
		frame: buildChannelsFrame(channels, url),
		snap: buildChannelsSnap(channels, url),
	}
}

export const actions: Actions = {
	open: frameAction,
	paginate: frameAction,
}
