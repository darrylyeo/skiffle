// Data
import type { PageLoad } from './$types'

import { channelsPageView } from './channels-frame'

export const load: PageLoad = async ({
	data,
	url,
}) => {
	const { currentPage, displayChannels, frame, hasMoreChannels, snap, visibleCount } = channelsPageView(data.channels, url)

	return {
		currentPage,
		...data,
		title: 'Popular Farcaster channels',
		displayChannels,
		frame,
		hasMoreChannels,
		snap,
		visibleCount,
	}
}
