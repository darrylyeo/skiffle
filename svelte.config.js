import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
	],

	kit: {
		adapter: (
			process.env.SVELTEKIT_ADAPTER === 'netlify' ?
				(await import('@sveltejs/adapter-netlify')).default()
			: process.env.SVELTEKIT_ADAPTER === 'vercel' ?
				(await import('@sveltejs/adapter-vercel')).default()
			:
				(await import('@sveltejs/adapter-auto')).default()
		),

		alias: {
			'$': './src',
		},
	},
}
