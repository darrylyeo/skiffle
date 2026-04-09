// Functions
import { counterFrameMeta } from './counter-frame'


// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ data }) => ({
	...data,
	frame: counterFrameMeta(data.count),
})
