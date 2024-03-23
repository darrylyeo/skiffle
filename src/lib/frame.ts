// Farcaster Frames
// https://docs.farcaster.xyz/reference/frames/spec


// Types
import type { TupleOf } from './TupleOf'

import type { FarcasterCastId, FarcasterUserId } from './farcaster'

export type FrameSignaturePacket<
	HasInputText extends boolean = boolean,
> = {
	untrustedData: {
		fid: FarcasterUserId,
		url: string,
		messageHash: `0x${string}`,
		timestamp: number,
		network: number,
		buttonIndex: 1 | 2 | 3 | 4,
		inputText?: HasInputText extends true ? string : never,
		castId: {
			fid: FarcasterUserId,
			hash: FarcasterCastId,
		},
	},
	trustedData: {
		messageBytes: string,
	},
}

export type FrameButton = {
	label: string,
	action?: 'post' | 'post_redirect' | 'mint' | 'link',
	targetUrl?: string,
}

export type FrameMeta = {
	version?: `${number}-${number}-${number}` | 'vNext',
	image: {
		url: string,
		aspectRatio?: `${1 | 1.91}:${1}`,
	},
	postUrl?: string,
	textInput?: string,
	buttons?: TupleOf<
		FrameButton | undefined,
		0 | 1 | 2 | 3 | 4
	>,
}
