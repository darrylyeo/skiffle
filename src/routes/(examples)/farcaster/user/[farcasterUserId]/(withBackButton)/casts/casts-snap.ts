// Types
import type { DemoUser } from '$/routes/(examples)/farcaster/api/farcaster-client'
import { frameButtons, type FrameMeta } from '$/lib/frame'
import type { SnapExtraElements } from '$/lib/snap-page-extra'
import type { AppSnapPage } from '$/lib/snap-components'

// Functions
import { AppSnapButtonRoles } from '$/lib/app-snap-tokens'
import type { DemoFarcasterCast } from '$/lib/farcaster-casts'
import { farcasterCastContent } from '$/lib/farcaster-casts'
import {
	findSnapButtonByRole,
	snapBackButton,
	snapButtonGroup,
	snapTargetButton,
} from '$/lib/snap-components'
import { isTruthy } from '$/lib/isTruthy'
import {
	SnapActions,
	SnapButtonVariants,
	SnapDirections,
	SnapElementTypes,
	SnapEvents,
	SnapGaps,
	SnapJustifyValues,
	SnapPaletteColors,
} from '$/lib/snap-spec'

/** `item_group` allows at most 6 children (@see https://docs.farcaster.xyz/snap/constraints). */
export const CASTS_SNAP_PAGE_SIZE = 3

const CASTS_SNAP_ITEM_TITLE_MAX = 30

export const castsSnapExtraElements = (
	casts: DemoFarcasterCast[],
): SnapExtraElements | undefined => {
	const slice = casts.slice(0, CASTS_SNAP_PAGE_SIZE)
	if (slice.length === 0) {
		return undefined
	}

	const itemIds: string[] = []
	const elements: SnapExtraElements['elements'] = {}

	for (const cast of slice) {
		const safeHash = cast.hash.replace(/^0x/i, '').slice(0, 20)
		const itemId = `casts-item-${safeHash}`
		const btnId = `casts-open-${safeHash}`
		itemIds.push(itemId)

		const castText = farcasterCastContent(cast.content)
		const title = (
			castText
				? (
					castText.length > CASTS_SNAP_ITEM_TITLE_MAX
						? `${castText.slice(0, CASTS_SNAP_ITEM_TITLE_MAX)}…`
						: castText
				)
				: 'Cast'
		)
		const description = farcasterCastContent(
			`${cast.reactionCount} reactions · ${cast.recastCount} recasts · ${cast.replyCount} replies`,
			160,
		)

		elements[itemId] = {
			type: SnapElementTypes.Item,
			props: {
				title,
				description,
			},
			children: [btnId],
		}

		elements[btnId] = {
			type: SnapElementTypes.Button,
			props: {
				label: 'View',
				variant: SnapButtonVariants.Secondary,
			},
			on: {
				[SnapEvents.Press]: {
					action: SnapActions.OpenUrl,
					params: { target: cast.url },
				},
			},
		}
	}

	elements['casts-item-group'] = {
		type: SnapElementTypes.ItemGroup,
		props: {
			separator: true,
			border: true,
			gap: SnapGaps.Sm,
		},
		children: itemIds,
	}

	return {
		children: ['casts-item-group'],
		elements,
	}
}

export const buildCastsSnapPage = ({
	user,
	casts,
	nextCursor,
	parentSnap,
}: {
	user: DemoUser,
	casts: DemoFarcasterCast[],
	nextCursor?: string,
	parentSnap?: AppSnapPage,
}): {
	snap: AppSnapPage,
	frame: FrameMeta,
} => {
	const backFromParent = findSnapButtonByRole(parentSnap?.buttons, AppSnapButtonRoles.Back)
	const backButton = backFromParent ?? snapBackButton('..')
	const extra = castsSnapExtraElements(casts)

	const backPress = backButton.press
	const backTargetUrl = (
		'targetUrl' in backPress && backPress.targetUrl
			? backPress.targetUrl
			: '..'
	)

	const snap: AppSnapPage = {
		castIntent: {
			text: `Browsing ${user.display_name}'s casts on the SKIFFLE demo snapsite 🗨️`,
		},
		theme: {
			accent: SnapPaletteColors.Blue,
		},
		buttons: [
			snapButtonGroup({
				direction: SnapDirections.Horizontal,
				gap: SnapGaps.Sm,
				justify: SnapJustifyValues.Center,
				children: (
					[
						backButton,
						...(nextCursor
							? [
								snapTargetButton({
									label: 'More ›',
									role: AppSnapButtonRoles.Pager,
									action: 'post',
									targetUrl: `./casts?/paginate&cursor=${encodeURIComponent(nextCursor)}`,
								}),
							]
							: []),
					]
						.filter(isTruthy)
				),
			}),
		],
		...(extra ? { extraElements: extra } : {}),
	}

	const frame: FrameMeta = {
		image: {
			aspectRatio: '1:1',
		},
		buttons: frameButtons({
			label: '‹ Back',
			action: 'post',
			targetUrl: backTargetUrl,
		}),
	}

	return { snap, frame }
}
