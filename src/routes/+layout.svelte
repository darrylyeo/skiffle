<script lang="ts">
	// Types/constants
	import { AppSnapScriptId } from '$/lib/app-snap-tokens'
	import { serializeAppSnapForHtml } from '$/lib/snap-components'


	// Styles
	import '$/styles/fonts.css'
	import '$/styles/app.css'


	// Context
	import { page } from '$app/state'

	let {
		url,
		data,
		data: {
			frame,
			snap,
			title = 'SKIFFLE',
			width = 764,
		},
	} = $derived(page)

	let aspectRatio = $derived(
	(frame?.image?.aspectRatio ?? '16:9')?.split(':').map(Number)
	)

	let height = $derived(
		width * aspectRatio[1] / aspectRatio[0]
	)

	let pageImageUrl = $derived.by(() => {
		const u = new URL(url)
		u.searchParams.set('image', '')
		return u.href
	})

	let snapJson = $derived(
		snap
			? serializeAppSnapForHtml(snap)
			: undefined
	)


	// Props
	const {
		children,
	} = $props()


	// Components
	import FrameMetadata from '$/components/FrameMetadata.svelte'
	import PageImage from '$/components/PageImage.svelte'
</script>


<svelte:head>
	<title>{title}</title>

	{#if snapJson}
		{@html `<script id="${AppSnapScriptId}" type="application/json">${snapJson}</script>`}
	{/if}
</svelte:head>

{#if frame}
	<FrameMetadata
		{title}
		metadata={{
			...frame,
			image: {
				...frame.image,
				url: pageImageUrl,
			},
		}}
		baseUrl={page.url}
	/>
{/if}


<div
	id="root"
	style:width={`${width}px`}
	style:height={`${height}px`}
>
	{@render children()}
</div>


{#if frame || snap}
	<details>
		<summary>Image preview</summary>

		<PageImage
			{title}
			src={pageImageUrl}
			alt={title ? `${title} preview` : 'Page preview'}
		/>
	</details>
{/if}


<style>
	:global(body) {
		height: 100dvh;
		display: flex;
		flex-wrap: wrap;
		place-content: safe center;
		place-items: center;
		gap: 1em;
	}

	#root {
		display: flex;
		flex-direction: column;
	}
</style>
