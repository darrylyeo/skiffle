import type { FrameMeta, FrameSignaturePacket } from './lib/frame'


// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}

		interface Locals {
			/**
			 * The last frame signature packet received from a Farcaster client as a result of the user clicking a frame button.
			 */
			frameSignaturePacket?: FrameSignaturePacket,
		}

		interface PageData {
			/**
			 * The title of the page that is being rendered as a frame.
			 */
			title?: string,

			/**
			 * The width of the frame image in pixels.
			 */
			width?: number,

			/**
			 * Farcaster frame metadata associated with this page, including image aspect ratio and buttons to render when this page's URL is embedded in a Farcaster cast.
			 */
			frame?: Omit<FrameMeta, 'image'> & { image?: Omit<FrameMeta['image'], 'url'> & { url?: string } },
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export {};
