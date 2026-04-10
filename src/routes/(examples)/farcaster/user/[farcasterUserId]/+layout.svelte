<script lang="ts">
	// Types
	import type { Snippet } from 'svelte'
	import type { PageData } from './$types'


	// Props
	const {
		children,
		data,
	}: {
		children: Snippet,
		data: PageData,
	} = $props()
</script>


<article class="column">
	<header class="row">
		<div class="row">
			<img src={data.user.pfp_url} alt={`${data.user.display_name} avatar`} />

			<div class="column">
				<div id="name" class="row">
					<h2>{data.user.display_name}</h2>

					<span>@{data.user.username}</span>
				</div>

				<p>{data.user.bio}</p>
			</div>
		</div>

		<div class="annotation">
			FID #{data.user.fid}
		</div>
	</header>

	{@render children()}
</article>


<style>
	article {
		row-gap: 2rem;
	}

	#name {
		justify-content: flex-start;
		gap: 0.75em;
	}

	img {
		width: 4em;
		height: 4em;
		border-radius: 0.5em;
	}

	.annotation {
		opacity: 0.75;
	}
</style>
