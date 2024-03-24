<script lang="ts">
	// Types
	import type { PageData } from './$types'


	// Props
	const {
		data,
	}: {
		data: PageData,
	} = $props()

	let {
		casts,
	} = data
</script>


<div class="column card">
	{#each casts.slice(0, 15) as cast}
		<div class="cast row">
			<p>{cast.content}</p>

			<span>
				<date>{new Date(cast.timestamp).toLocaleString()}</date>
			</span>
		</div>
	{/each}
</div>


<style>
	.card {
		padding: 1.25em;
		border-radius: 1em;
		background-color: rgba(255, 255, 255, 0.05);
		overflow: hidden;
	}

	p {
		line-height: 1.5;
	}

	date {
		opacity: 0.75;
		font-size: 0.75em;
		white-space: nowrap;
	}
</style>
