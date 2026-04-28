import {
	AppSnapButtonRoles,
	AppSnapNodeTypes,
	AppSnapScriptId,
	type AppSnapButtonRole,
} from './app-snap-tokens'
import type { FrameButton } from './frame'
import {
	SnapActions,
	type SnapButtonVariant,
	type SnapDirection,
	type SnapEffect,
	type SnapGap,
	type SnapJustify,
	type SnapPaletteColor,
} from './snap-spec'
import type { SnapExtraElements } from './snap-page-extra'

export type AppSnapButtonPress = (
	| {
		action?: FrameButton['action']
		targetUrl?: string
	}
	| {
		action: typeof SnapActions.Submit | typeof SnapActions.OpenUrl | typeof SnapActions.OpenMiniApp
		targetUrl: string
	}
	| {
		action: typeof SnapActions.ViewToken
		token: string
	}
	| {
		action: typeof SnapActions.ComposeCast
		text: string
		embeds?: string[]
	}
)

export type AppSnapButton = {
	type: typeof AppSnapNodeTypes.Button
	label: string
	role?: AppSnapButtonRole
	variant?: SnapButtonVariant
	icon?: string
	press: AppSnapButtonPress
}

export type AppSnapButtonGroup = {
	type: typeof AppSnapNodeTypes.Group
	direction?: SnapDirection
	gap?: SnapGap
	justify?: SnapJustify
	children: AppSnapButtonNode[]
}

export type AppSnapButtonNode = AppSnapButton | AppSnapButtonGroup

export type AppSnapCastIntent = {
	text?: string
	embeds?: string[]
}

export const castIntentEmbeds = ({
	pageEmbeds,
	currentPageUrl,
	defaultEmbeds,
}: {
	pageEmbeds?: string[]
	currentPageUrl?: string
	defaultEmbeds?: readonly string[]
}) => (
	[
		...(pageEmbeds ?? []),
		...(currentPageUrl ? [currentPageUrl] : []),
		...(defaultEmbeds ?? []),
	]
		.map((url) => url.trim())
		.filter((url) => url.length > 0)
)

export type AppSnapPage = {
	theme?: {
		accent?: SnapPaletteColor
	}
	effects?: SnapEffect[]
	castIntent?: AppSnapCastIntent
	buttons?: AppSnapButtonNode[]
	/** Merged into snap `ui.elements` (with demo-game extras). Max 64 elements total. */
	extraElements?: SnapExtraElements
}

type AppSnapTargetButton = {
	label: string
	role?: AppSnapButtonRole
	variant?: SnapButtonVariant
	icon?: string
	action?: FrameButton['action'] | typeof SnapActions.Submit | typeof SnapActions.OpenUrl | typeof SnapActions.OpenMiniApp
	targetUrl: string
}

export const snapButton = (
	button: Omit<AppSnapButton, 'type'>,
): AppSnapButton => ({
	type: AppSnapNodeTypes.Button,
	...button,
})

export const snapButtonGroup = (
	group: Omit<AppSnapButtonGroup, 'type'>,
): AppSnapButtonGroup => ({
	type: AppSnapNodeTypes.Group,
	...group,
})

export const snapTargetButton = ({
	action,
	targetUrl,
	...button
}: AppSnapTargetButton): AppSnapButton => (
	snapButton({
		...button,
		press: {
			...(action ? { action } : {}),
			targetUrl,
		},
	})
)

export const snapBackButton = (
	targetUrl: string,
	label = '‹ Back',
): AppSnapButton => (
	snapTargetButton({
		label,
		role: AppSnapButtonRoles.Back,
		action: 'post',
		targetUrl,
	})
)

export const findSnapButtonByRole = (
	nodes: AppSnapButtonNode[] | undefined,
	role: AppSnapButtonRole,
): AppSnapButton | undefined => {
	for (const node of nodes ?? []) {
		if (node.type === AppSnapNodeTypes.Button) {
			if (node.role === role) {
				return node
			}

			continue
		}

		const child = findSnapButtonByRole(node.children, role)

		if (child) {
			return child
		}
	}

	return undefined
}

export const serializeAppSnapForHtml = (snap: AppSnapPage) => (
	JSON
		.stringify(snap)
		.replaceAll('<', '\\u003c')
		.replaceAll('</script', '<\\/script')
)

export const parseAppSnapFromHtml = (html: string): AppSnapPage | undefined => {
	const content = html.match(
		new RegExp(
			`<script[^>]+id="${AppSnapScriptId}"[^>]*>([\\s\\S]*?)<\\/script>`,
			'i',
		),
	)?.[1]

	if (!content) {
		return undefined
	}

	try {
		return JSON.parse(content)
	} catch {
		return undefined
	}
}
