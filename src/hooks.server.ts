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


// Form Actions
import { deserialize } from '$app/forms'


// Frames
import { createFrameResponse, type FrameMeta } from './lib/frame'


// Hooks
export const handle: Handle = async ({
	event,
	resolve,
}) => {
	const contentTypes = event.request.headers.get('accept')

	console.info('\nHANDLE\n' + event.url.pathname, event.route, {
		method: event.request.method,
		contentTypes,
	})

	// Image redirect
	if(event.url.searchParams.has('frameImage')) {
		const url = new URL(event.url)

		url.searchParams.delete('frameImage')

		return fetch(url, {
			method: 'GET',
			headers: new Headers({
				'accept': 'image/png',
			}),
		})
	}

	// Svelte → HTML → Image
	if (
		event.request.method === 'GET'
		&& (contentTypes && contentTypes.includes('image/') && !contentTypes.includes('text/html'))
	) {
		console.info(event.url.pathname, 'Rendering Svelte → HTML...')

		const response = await resolve(event)

		if(response.status !== 200) {
			const result = await response.text()
			console.error('Error rendering Svelte → HTML:', result)
			return response
		}

		console.info(event.url.pathname, 'Rendering HTML → SVG...')

		const html = await response.text()

		const styles = [
			css,
			...await Promise.all(
				[...html.matchAll(/<link href="([^"]+)" rel="stylesheet">/g)].map((match) => match[1])
					.map(async (href) => {
						const response = await fetch(new URL(href, event.request.url).href)
						return response.text()
					})
			)
		]

		const reactNode = toReactNode(`<style>${styles.join('\n')}</style>${html}`)

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
		console.info(event.url.pathname, 'Rendering SVG → PNG...')

		const png = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: width,
			}
		})
			.render()
			.asPng()

		console.info(event.url.pathname, 'Rendered.')

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
		console.info('Frame Button Action')

		// Parse Frame Signature Packet
		const frameSignaturePacket = await event.request.json() as FrameSignaturePacket
		event.locals.frameSignaturePacket = frameSignaturePacket


		// Handle with SvelteKit Form Action
		event.request.headers.set('content-type', 'text/plain')

		const response = await resolve(event)

		if(response.ok){
			console.info('Handling with SvelteKit Form Action...')

			const { data } = deserialize(await response.text()) as { data: { frame: FrameMeta } }

			console.info('Frame:', data.frame)

			return createFrameResponse(data.frame, event.request.url)
		}


		// Handle with SvelteKit GET request
		console.info('Handling with SvelteKit GET request...')
		event.request = new Request(event.request.url, {
			method: 'GET',
			headers: event.request.headers,
		})

		return await resolve(event)
	}

	return await resolve(event)
}
