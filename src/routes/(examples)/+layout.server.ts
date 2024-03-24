import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
	locals: { frameSignaturePacket },
}) => {
	return {
		frameSignaturePacket,
	}
}
