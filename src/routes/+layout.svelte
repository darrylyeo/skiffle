<script lang="ts">
	// Styles
	import '$/styles/app.css'
	import '$/styles/fonts.css'


	// Context
	import { page } from '$app/stores'


	// Props
	const {
		children,
	} = $props()


	// Components
	import FrameMetadata from '$/components/FrameMetadata.svelte'
</script>


{#if $page.data.frame}
	<FrameMetadata
		metadata={{
			image: {
				url: $page.url.href,
			},
			...$page.data.frame,
		}}
		baseUrl={$page.url}
	/>
{/if}


<div
	style:width="400px"
	style:height="400px"
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
