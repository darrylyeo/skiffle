// Data
import type { PageLoad } from './$types'

export const load: PageLoad = async ({
	data,
}) => (
	{
		...data,
		title: `${data.user.display_name}'s casts`,
	}
)
