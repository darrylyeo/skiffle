import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

const normalizeGoToTarget = (
	value: string,
	from: URL,
) => {
	const trimmed = value.trim()

	if (
		!trimmed
		|| /^[a-z][a-z\d+\-.]*:/i.test(trimmed)
		|| trimmed.startsWith('//')
	) {
		return undefined
	}

	const resolved = new URL(
		trimmed.startsWith('/') || trimmed.startsWith('?') || trimmed.startsWith('#')
			? trimmed
			: `./${trimmed}`,
		from,
	)

	return resolved.origin === from.origin
		? `${resolved.pathname}${resolved.search}${resolved.hash}`
		: undefined
}

export const actions: Actions = {
	default: async ({
		request,
		url,
	}) => {
		const formData = await request.formData()
		const from = new URL(
			String(formData.get('from') ?? url.searchParams.get('from') ?? request.headers.get('referer') ?? '/'),
			url,
		)
		const target = normalizeGoToTarget(
			String(formData.get('gotoPath') ?? ''),
			from,
		)

		if (!target) {
			return fail(
				400,
				{
					error: 'Enter a relative URL like /about or /demos/wordle',
				},
			)
		}

		if (request.headers.get('x-sveltekit-action') === 'true') {
			return {
				gotoUrl: target,
			}
		}

		redirect(303, target)
	},
}
