import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
	],

	kit: {
		// adapter-auto picks Netlify / Vercel / etc. from NETLIFY, VERCEL, …
		adapter: (await import('@sveltejs/adapter-auto')).default(),

		alias: {
			'$': './src',
		},
	},
}
