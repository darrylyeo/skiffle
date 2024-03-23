<script lang="ts">
	// Types
	import type { FrameMeta } from '$/lib/frame'


	// Functions
	import { serializeFrameMeta } from '$/lib/frame'


	// Props
	const {
		metadata,
	}: {
		metadata: FrameMeta,
	} = $props()


	// Derived
	const metaTags = $derived(serializeFrameMeta(metadata))
</script>


<svelte:head>
	{#each metaTags as { property, content }}
		<meta property={property} content={content} />
	{/each}
</svelte:head>
