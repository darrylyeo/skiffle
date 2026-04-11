export const SnapMediaType = 'application/vnd.farcaster.snap+json' as const
export const SnapVersion = '2.0' as const

export const SnapActions = {
	Submit: 'submit',
	OpenUrl: 'open_url',
	OpenSnap: 'open_snap',
	OpenMiniApp: 'open_mini_app',
	ViewCast: 'view_cast',
	ViewProfile: 'view_profile',
	ViewToken: 'view_token',
	ComposeCast: 'compose_cast',
	SendToken: 'send_token',
	SwapToken: 'swap_token',
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
	None: 'none',
	Sm: 'sm',
	Md: 'md',
	Lg: 'lg',
} as const

export type SnapGap = typeof SnapGaps[keyof typeof SnapGaps]

export const SnapJustifyValues = {
	Start: 'start',
	Center: 'center',
	End: 'end',
	Between: 'between',
	Around: 'around',
} as const

export type SnapJustify = typeof SnapJustifyValues[keyof typeof SnapJustifyValues]

export const SnapTextSizes = {
	Md: 'md',
	Sm: 'sm',
} as const

export type SnapTextSize = typeof SnapTextSizes[keyof typeof SnapTextSizes]

export const SnapTextWeights = {
	Bold: 'bold',
	Normal: 'normal',
} as const

export type SnapTextWeight = typeof SnapTextWeights[keyof typeof SnapTextWeights]

export const SnapAlignments = {
	Left: 'left',
	Center: 'center',
	Right: 'right',
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
	ArrowLeft: 'arrow-left',
	ChevronRight: 'chevron-right',
	Check: 'check',
	AlertTriangle: 'alert-triangle',
	Info: 'info',
	Clock: 'clock',
	Heart: 'heart',
	MessageCircle: 'message-circle',
	Repeat: 'repeat',
	Share: 'share',
	User: 'user',
	Users: 'users',
	Star: 'star',
	Trophy: 'trophy',
	Zap: 'zap',
	Flame: 'flame',
	Gift: 'gift',
	Image: 'image',
	Play: 'play',
	Pause: 'pause',
	ExternalLink: 'external-link',
	Wallet: 'wallet',
	Coins: 'coins',
	Plus: 'plus',
	Minus: 'minus',
	RefreshCw: 'refresh-cw',
	Bookmark: 'bookmark',
	ThumbsUp: 'thumbs-up',
	ThumbsDown: 'thumbs-down',
	TrendingUp: 'trending-up',
	TrendingDown: 'trending-down',
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
	BarChart: 'bar_chart',
	Button: 'button',
	CellGrid: 'cell_grid',
	Icon: 'icon',
	Image: 'image',
	Item: 'item',
	ItemGroup: 'item_group',
	Input: 'input',
	Progress: 'progress',
	Separator: 'separator',
	Slider: 'slider',
	Stack: 'stack',
	Switch: 'switch',
	Text: 'text',
	ToggleGroup: 'toggle_group',
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
