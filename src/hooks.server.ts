// Types
import { type Handle } from '@sveltejs/kit'


// Rendering
import satori from 'satori'
import { html as toReactNode } from 'satori-html'
import { Resvg } from '@resvg/resvg-js'


// Fonts
import { fonts } from '$/styles/fonts'


// Styles
import css from '$/styles/app.css?raw'


// Hooks
export const handle: Handle = async ({
	event,
	resolve,
}) => {
	const result = await resolve(event)

	const html = await result.text()

	const reactNode = toReactNode(`<style>${css}</style>${html}`)

	const content = (
		reactNode
			.props.children.find((child) => child?.type === 'html')
			.props.children.find((child) => child?.type === 'body')
			.props.children.find((child) => child?.type === 'div')
			.props.children.find((child) => child)
	) as unknown as ReturnType<typeof toReactNode>

	const width = Number(content.props.style.width.match(/\d+/)![0])
	const height = Number(content.props.style.height.match(/\d+/)![0])

	const svg = await satori(
		content,
		{
			fonts,
			width,
			height,
		}
	)

	const png = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width,
		}
	})
		.render()
		.asPng()

	return new Response(
		png,
		{
			headers: {
				'content-type': 'image/png',
			},
		},
	)
}
