import { getPopularChannels } from '../api/farcaster-client'
import type { PageServerLoad } from './$types'

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
