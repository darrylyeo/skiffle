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
	<FarcasterCastList casts={data.casts.slice(0, 15)} />
</div>


<style>
	.card {
		padding: 1.25em;
		border-radius: 1em;
		background-color: rgba(255, 255, 255, 0.05);
		overflow: hidden;
	}

</style>
