import type { FrameMeta } from '$/lib/frame'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
	return {
		frame: {} as FrameMeta
	}
}
