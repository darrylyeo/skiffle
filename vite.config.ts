import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		// Keep `?url` imports (Twemoji SVG, fonts) as file URLs so `$app/server` `read()` works; avoids `data:` payloads that break `read()`.
		assetsInlineLimit: 0,
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
