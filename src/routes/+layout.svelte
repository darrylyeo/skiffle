<script lang="ts">
	// Styles
	import '$/styles/app.css'
	import '$/styles/fonts.css'


	// Context
	import { page } from '$app/stores'

	let {
		url,
		data: {
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


	// Props
	const {
		children,
	} = $props()


	// Components
	import FrameMetadata from '$/components/FrameMetadata.svelte'
</script>


{#if frame}
	<FrameMetadata
		metadata={{
			...frame,
			image: {
				...frame.image,
				url: `${url.href}`,
			},
		}}
		baseUrl={$page.url}
	/>
{/if}


<div
	style:width={`${width}px`}
	style:height={`${height}px`}
>
	{@render children()}
</div>


<style>
	div {
		display: flex;
		flex-direction: column;

		background-image: linear-gradient(135deg, #8a63d2, #ff3e00);

		font-family: 'Ubuntu';
	}
</style>
