<script lang="ts">
	// Styles
	import '$/styles/app.css'
	import '$/styles/fonts.css'


	// Context
	import { dev } from '$app/environment'
	import { page } from '$app/stores'

	let {
		url,
		data: {
			title,
			frame,
			width = 764,
		},
	} = $derived($page)

	let aspectRatio = $derived(
		(frame?.image?.aspectRatio ?? '1.91:1')?.split(':').map(Number)
	)

	let height = $derived(
		width * aspectRatio[1] / aspectRatio[0]
	)
	
	let frameImageUrl = $derived.by(() => {
		const _url = new URL(url)
		// _url.searchParams.set('frameImage', '')
		return _url.href
	})


	// Props
	const {
		children,
	} = $props()


	// Components
	import FrameMetadata from '$/components/FrameMetadata.svelte'
</script>


<div
	id="root"
	style:width={`${width}px`}
	style:height={`${height}px`}
>
	{@render children()}
</div>


{#if frame}
	<FrameMetadata
		{title}
		metadata={{
			...frame,
			image: {
				...frame.image,
				url: frameImageUrl,
			},
		}}
		baseUrl={$page.url}
		showPreview={true}
	/>
{/if}


<style>
	:global(body) {
		height: 100dvh;
		display: flex;
		flex-wrap: wrap;
		place-content: center;
		place-items: center;
		gap: 1em;
	}

	#root {
		display: flex;
		flex-direction: column;
	}
</style>
