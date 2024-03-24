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

	let {
		user,
	} = data
</script>


<article class="column">
	<header class="row">
		<div class="row">
			<img src={user.pfp_url} />

			<div class="column">
				<div id="name" class="row">
					<h2>{user.display_name}</h2>

					<span>@{user.username}</span>
				</div>

				<p>{user.bio}</p>
			</div>
		</div>

		<div class="annotation">
			FID #{user.fid}
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
