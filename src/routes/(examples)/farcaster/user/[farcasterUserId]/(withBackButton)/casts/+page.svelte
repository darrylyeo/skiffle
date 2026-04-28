<script lang="ts">
	// Types
	import type { PageData } from './$types'

	// Components
	import FarcasterCastList from '$/lib/FarcasterCastList.svelte'


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
		background-color: rgb(52, 42, 86);
		overflow: hidden;
		gap: 1em;
	}

	.more a {
		display: flex;
		align-items: center;
		padding: 0.65em 1em;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 999px;
		background-color: rgb(68, 56, 108);
		color: rgba(255, 255, 255, 0.9);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9em;
	}

	.more {
		justify-content: center;
	}

</style>
