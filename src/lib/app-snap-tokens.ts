export const AppSnapScriptId = 'skiffle-snap'

export const AppSnapNodeTypes = {
	Button: 'button',
	Group: 'group',
} as const

export type AppSnapNodeType = typeof AppSnapNodeTypes[keyof typeof AppSnapNodeTypes]

export const AppSnapButtonRoles = {
	Back: 'back',
	Pager: 'pager',
	Cta: 'cta',
	External: 'external',
	Share: 'share',
} as const

export type AppSnapButtonRole = (
	| typeof AppSnapButtonRoles[keyof typeof AppSnapButtonRoles]
	| (string & {})
)
