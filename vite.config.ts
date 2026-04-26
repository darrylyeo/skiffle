import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		external: [
			'@datawrapper/twemoji-svg',
			'@fontsource/fira-code',
			'@fontsource/noto-sans-jp',
			'@fontsource/noto-sans-symbols-2',
			'@fontsource/ubuntu',
		],
	},
	esbuild: {
		jsx: 'automatic',
		jsxImportSource: 'satori/jsx',
	},
	server: {
		host: true,
		allowedHosts: true,
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
