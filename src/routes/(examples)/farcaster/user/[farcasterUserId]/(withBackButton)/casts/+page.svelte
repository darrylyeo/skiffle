<script lang="ts">
	// Types
	import type { PageData } from './$types'

	// Components
	import FarcasterCastList from '$/lib/FarcasterCastList.svelte'
	import farcasterLogoUrl from '$lib/assets/branding/farcaster-logo.svg'


	// Props
	const {
		data,
	}: {
		data: PageData,
	} = $props()
</script>


<div class="column card">
	<img
		class="card-watermark"
		src={farcasterLogoUrl}
		alt=""
		aria-hidden="true"
	/>

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
		position: relative;
		padding: 1.25em;
		border-radius: 1em;
		background-color: rgba(58, 38, 98, 0.62);
		background-image: linear-gradient(180deg, rgba(126, 90, 197, 0.22), rgba(40, 26, 68, 0.2));
		overflow: hidden;
		gap: 1em;
	}

	.card-watermark {
		position: absolute;
		top: -2.1em;
		right: -2.4em;
		width: 12em;
		height: 12em;
		opacity: 0.08;
		transform: rotate(9deg);
		pointer-events: none;
	}

	.more a {
		display: flex;
		align-items: center;
		padding: 0.65em 1em;
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 999px;
		background-color: rgba(78, 54, 122, 0.62);
		background-image: linear-gradient(180deg, rgba(178, 146, 255, 0.2), rgba(65, 44, 101, 0.18));
		color: rgba(255, 255, 255, 0.9);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9em;
	}

	.more {
		justify-content: center;
	}

</style>
