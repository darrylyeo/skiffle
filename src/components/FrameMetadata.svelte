<script lang="ts">
	// Types
	import type { FrameMeta } from '$/lib/frame'


	// Functions
	import { serializeFrameMeta } from '$/lib/frame'


	// Props
	const {
		title,
		metadata,
		baseUrl,
		showPreview = false,
	}: {
		title?: string,
		metadata: FrameMeta,
		baseUrl: URL | string,
		showPreview?: boolean,
	} = $props()


	// Derived
	const metaTags = $derived(
		[
			...title
				? [{
					property: 'og:title',
					content: title,
				}]
				: [],
			...serializeFrameMeta(metadata, baseUrl),
		],
	)
</script>


<svelte:head>
	{#if title}
		<title>{title}</title>
	{/if}

	{#each metaTags as { property, content }}
		{#if property === 'fc:frame:image'}
			<meta property="og:image" content={content} />
		{/if}

		<meta property={property} content={content} />
	{/each}
</svelte:head>

{#if showPreview}
	<div class="frame-preview">
		{title}

		<img src={metadata.image.url} alt="Frame" />
	</div>
{/if}


<style>
	.frame-preview {
		display: grid;
	}
</style>
