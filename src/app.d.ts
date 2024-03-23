import type { FrameMeta } from './lib/frame'


// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}

		interface PageData {
			frame?: Omit<FrameMeta, 'image'> & { image?: Omit<FrameMeta['image'], 'url'> & { url?: string } },
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export {};
