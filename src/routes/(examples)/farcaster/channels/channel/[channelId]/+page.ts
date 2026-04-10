// Data
import type { PageLoad } from './$types'

import { channelPageView } from './channel-frame'

export const load: PageLoad = async ({
	data,
	url,
}) => {
	const { displayCasts, frame, hasMoreCasts, snap, visibleCount } = channelPageView(data.channel, data.casts, url)

	return {
		...data,
		displayCasts,
		frame,
		hasMoreCasts,
		isFrameImage: url.searchParams.has('frameImage'),
		snap,
		title: `/${data.channel.key}`,
		visibleCount,
	}
}
