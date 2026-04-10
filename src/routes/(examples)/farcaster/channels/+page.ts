// Data
import type { PageLoad } from './$types'

import { channelsPageView } from './channels-frame'

export const load: PageLoad = async ({
	data,
	url,
}) => {
	const { displayChannels, frame, snap } = channelsPageView(data.channels, url)

	return {
		...data,
		title: 'Popular Farcaster channels',
		displayChannels,
		frame,
		snap,
	}
}
