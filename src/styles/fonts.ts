import { readFileSync } from 'fs'

export const fonts = ([
	{
		name: 'Fira Code',
		data: readFileSync(`${process.cwd()}/node_modules/@fontsource/fira-code/files/fira-code-latin-400-normal.woff`),
		style: 'normal',
		weight: 400,
	},
	{
		name: 'Fira Code',
		data: readFileSync(`${process.cwd()}/node_modules/@fontsource/fira-code/files/fira-code-latin-500-normal.woff`),
		style: 'normal',
		weight: 500,
	},
	{
		name: 'Fira Code',
		data: readFileSync(`${process.cwd()}/node_modules/@fontsource/fira-code/files/fira-code-latin-600-normal.woff`),
		style: 'normal',
		weight: 600,
	},
	{
		name: 'Fira Code',
		data: readFileSync(`${process.cwd()}/node_modules/@fontsource/fira-code/files/fira-code-latin-700-normal.woff`),
		style: 'normal',
		weight: 700,
	},
	{
		name: 'Ubuntu',
		data: readFileSync(`${process.cwd()}/node_modules/@fontsource/ubuntu/files/ubuntu-latin-400-normal.woff`),
		style: 'normal',
		weight: 400,
	},
	{
		name: 'Ubuntu',
		data: readFileSync(`${process.cwd()}/node_modules/@fontsource/ubuntu/files/ubuntu-latin-500-normal.woff`),
		style: 'normal',
		weight: 500,
	},
	{
		name: 'Ubuntu',
		data: readFileSync(`${process.cwd()}/node_modules/@fontsource/ubuntu/files/ubuntu-latin-700-normal.woff`),
		style: 'normal',
		weight: 700,
	},
] as const)
	.filter(font => font.data)
