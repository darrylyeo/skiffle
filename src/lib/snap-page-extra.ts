// Types
import type { FrameMeta } from '$/lib/frame'

// Functions
import { resolveUrl } from '$/lib/resolveUrl'

export type SnapExtraElements = {
	children: string[]
	hideInput?: boolean
	elements: Record<
		string,
		{
			type: string
			props: Record<string, unknown>
			children?: string[]
			on?: Record<
				string,
				{
					action: string
					params?: Record<string, unknown>
				}
			>
		}
	>
}

export const frameStateUrlFromFrame = (
	frame: FrameMeta,
	baseUrl: URL | string,
) => (
	new URL(
		resolveUrl(
			frame.image.url || String(baseUrl),
			baseUrl,
		),
	)
)
