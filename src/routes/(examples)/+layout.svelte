<script lang="ts">
	// Context
	import { page } from '$app/stores'


	// Props
	import type { Snippet } from 'svelte'

	let {
		children,
	}: {
		children: Snippet,
	} = $props()

	let url = $page.url
</script>


<div
	class="layout column"
>
	<div
		class="column"
	>
		<main class="column">
			{@render children()}
		</main>

		<footer class="row">
			<div class="row">
				<p>
					<output
						class="url"
					>
						<strong>{url.host}</strong>{url.pathname.replace(/\/$/, '')}{url.search}
					</output>
				</p>
			</div>

			<p class="annotation">@darrylyeo</p>
		</footer>
	</div>
</div>


<style>
	.layout {
		position: relative;
		color: #fff;
		height: 100%;

		background-image: linear-gradient(135deg, #8a63d2, #ff3e00);
		font-family: 'Ubuntu';
		font-size: 16px;
	}


	.layout > * {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		padding: 2em;
		row-gap: 2em;
	}

	header {
		justify-content: flex-start;
		gap: 2.25em;
	}

	main {
		flex: 1;
		overflow: hidden;
	}

	.url {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
	}
	.url strong {
		color: rgba(255, 255, 255, 0.75);
	}

	.annotation {
		opacity: 0.75;
		font-size: 14px;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.6);
	}
</style>
