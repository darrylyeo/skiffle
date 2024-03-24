<script lang="ts">
	// Types
	import type { FrameMeta } from '$/lib/frame'


	// Functions
	import { serializeFrameMeta } from '$/lib/frame'


	// Props
	const {
		metadata,
		baseUrl,
	}: {
		metadata: FrameMeta,
		baseUrl: URL | string,
	} = $props()


	// Derived
	const metaTags = $derived(serializeFrameMeta(metadata, baseUrl))
</script>


<svelte:head>
	{#each metaTags as { property, content }}
		{#if property === 'fc:frame:image'}
			<meta property="og:image" content={content} />
		{/if}

		<meta property={property} content={content} />
	{/each}
</svelte:head>
