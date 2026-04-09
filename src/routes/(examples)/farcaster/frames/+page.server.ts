// Functions
import '../api/karma3labs'
import { ScoreAgg, getTopFramesFramesGlobalRankingsGet } from '../api/openrank/farcaster-graph'


// Data
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const { result: topFrames } = await getTopFramesFramesGlobalRankingsGet({
		agg: ScoreAgg.Sumsquare,
		weights: 'L1C10R5',
		details: true,
		offset: 0,
		limit: 10,
	})

	return {
		topFrames,
	}
}
