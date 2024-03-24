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


<div class="column">
	<header class="row">
		<div class="row">
			<img src={user.pfp_url} />

			<div id="name" class="row">
				<h1>{user.display_name}</h1>

				<span>@{user.username}</span>
			</div>
		</div>

		<div class="annotation">
			#{user.fid}
		</div>
	</header>

	<p>{user.bio}</p>

	{@render children()}
</div>


<style>
	#name {
		gap: 0.75em;
	}

	img {
		width: 2.5em;
		height: 2.5em;
	}

	.annotation {
		opacity: 0.75;
	}
</style>
