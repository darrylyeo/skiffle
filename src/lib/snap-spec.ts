export const SnapMediaType = 'application/vnd.farcaster.snap+json' as const
export const SnapVersion = '2.0' as const

export const SnapActions = {
	Submit: 'submit',
	OpenUrl: 'open_url',
	OpenMiniApp: 'open_mini_app',
	ViewToken: 'view_token',
	ComposeCast: 'compose_cast',
} as const

export type SnapAction = typeof SnapActions[keyof typeof SnapActions]

export const SnapButtonVariants = {
	Primary: 'primary',
	Secondary: 'secondary',
} as const

export type SnapButtonVariant = typeof SnapButtonVariants[keyof typeof SnapButtonVariants]

export const SnapDirections = {
	Horizontal: 'horizontal',
	Vertical: 'vertical',
} as const

export type SnapDirection = typeof SnapDirections[keyof typeof SnapDirections]

export const SnapGaps = {
	Sm: 'sm',
	Md: 'md',
	Lg: 'lg',
} as const

export type SnapGap = typeof SnapGaps[keyof typeof SnapGaps]

export const SnapJustifyValues = {
	Start: 'start',
	Center: 'center',
	End: 'end',
	SpaceBetween: 'space-between',
} as const

export type SnapJustify = typeof SnapJustifyValues[keyof typeof SnapJustifyValues]

export const SnapTextSizes = {
	Sm: 'sm',
} as const

export type SnapTextSize = typeof SnapTextSizes[keyof typeof SnapTextSizes]

export const SnapTextWeights = {
	Bold: 'bold',
} as const

export type SnapTextWeight = typeof SnapTextWeights[keyof typeof SnapTextWeights]

export const SnapAlignments = {
	Center: 'center',
} as const

export type SnapAlign = typeof SnapAlignments[keyof typeof SnapAlignments]

export const SnapPaletteColors = {
	Purple: 'purple',
	Blue: 'blue',
	Green: 'green',
	Amber: 'amber',
	Teal: 'teal',
	Red: 'red',
	Pink: 'pink',
	Gray: 'gray',
} as const

export type SnapPaletteColor = typeof SnapPaletteColors[keyof typeof SnapPaletteColors]

export const SnapIcons = {
	ArrowRight: 'arrow-right',
	Check: 'check',
	Share: 'share',
	ExternalLink: 'external-link',
	Wallet: 'wallet',
	X: 'x',
} as const

export type SnapIcon = typeof SnapIcons[keyof typeof SnapIcons]

export const SnapEffects = {
	Confetti: 'confetti',
} as const

export type SnapEffect = typeof SnapEffects[keyof typeof SnapEffects]

export const SnapEvents = {
	Press: 'press',
} as const

export type SnapEvent = typeof SnapEvents[keyof typeof SnapEvents]

export const SnapElementTypes = {
	Badge: 'badge',
	Button: 'button',
	CellGrid: 'cell_grid',
	Image: 'image',
	Input: 'input',
	Separator: 'separator',
	Stack: 'stack',
	Text: 'text',
} as const

export type SnapElementType = typeof SnapElementTypes[keyof typeof SnapElementTypes]

export const SnapUiRoots = {
	Page: 'page',
} as const

export type SnapUiRoot = typeof SnapUiRoots[keyof typeof SnapUiRoots]

export const SnapImageAspects = {
	Square: '1:1',
	Wide: '16:9',
	Standard: '4:3',
	Portrait: '9:16',
} as const

export type SnapImageAspect = typeof SnapImageAspects[keyof typeof SnapImageAspects]
