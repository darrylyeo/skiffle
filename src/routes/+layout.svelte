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


<main
	style:width={400}
	style:height={400}
>
	{@render children()}
</main>


<style>
	main {
		font-family: 'Ubuntu';
		padding: 1em;
	}
</style>
