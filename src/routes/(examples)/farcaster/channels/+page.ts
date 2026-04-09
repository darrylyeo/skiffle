// Data
import type { PageLoad } from './$types'

import { channelsPageView } from './channels-frame'

export const load: PageLoad = async ({
	data,
	url,
}) => {
	const { displayChannels, frame } = channelsPageView(data.channels, url)

	return {
		...data,
		displayChannels,
		frame,
	}
}
