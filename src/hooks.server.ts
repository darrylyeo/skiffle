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
	const contentTypes = event.request.headers.get('accept')

	if (contentTypes && contentTypes.includes('image/') && !contentTypes.includes('text/html')) {
		const result = await resolve(event)

		if(result.status !== 200) {
			return result
		}

		const html = await result.text()

		const reactNode = toReactNode(`<style>${css}</style>${html}`)

		const contentRoot = (
			reactNode
				.props.children.find((child) => child?.type === 'html')
				.props.children.find((child) => child?.type === 'body')
				.props.children.find((child) => child?.type === 'div')
				.props.children.find((child) => child)
		) as unknown as ReturnType<typeof toReactNode>

		const width = Number(contentRoot.props.style.width.match(/\d+/)![0])
		const height = Number(contentRoot.props.style.height.match(/\d+/)![0])

		const svg = await satori(
			contentRoot,
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

	// Frame Button "post" Action
	if (
		event.request.method === 'POST'
		&& event.request.headers.get('content-type') === 'application/json'
	) {
		// Handle with SvelteKit GET request
		event.request = new Request(event.request.url, {
			method: 'GET',
			headers: event.request.headers,
		})

		return await resolve(event)
	}

	return await resolve(event)
}
