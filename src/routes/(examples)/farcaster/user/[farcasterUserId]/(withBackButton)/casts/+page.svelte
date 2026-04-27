<script lang="ts">
	// Components
	import FarcasterCastList from '$/lib/FarcasterCastList.svelte'

	// Types
	import type { PageData } from './$types'


	// Props
	const {
		data,
	}: {
		data: PageData,
	} = $props()
</script>


<div class="column card">
	<FarcasterCastList casts={data.casts} />

	<!-- load more disabled: change #if false -> #if data.nextCursor to re-enable -->
	{#if false}
		<p class="more row">
			<a href={`?cursor=${encodeURIComponent(data.nextCursor ?? '')}`}>
				Older casts
			</a>
		</p>
	{/if}
</div>


<style>
	.card {
		padding: 1.25em;
		border-radius: 1em;
		background-color: rgba(255, 255, 255, 0.05);
		overflow: hidden;
		gap: 1em;
	}

	.more {
		justify-content: center;
	}

	.more a {
		padding: 0.65em 1em;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.9);
		text-decoration: none;
	}

</style>
