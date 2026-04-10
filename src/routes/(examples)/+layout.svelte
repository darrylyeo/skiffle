<script lang="ts">
	// Context
	import { page } from '$app/stores'

	let url = $page.url


	// Props
	import type { Snippet } from 'svelte'
	import type { PageData } from './$types'

	let {
		children,
		data,
	}: {
		children: Snippet,
		data: PageData,
	} = $props()
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

		<footer class="footer row">
			<p>
				<output class="url-badge">
					{url.origin}{url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '')}{url.search}
				</output>
			</p>

			<p class="annotation">by @darrylyeo</p>
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

	main {
		flex: 1;
		overflow: hidden;
	}

	.footer {
		justify-content: space-between;
		align-items: center;
		gap: 1em;
	}

	.url-badge {
		display: block;
		padding: 0.35em 0.65em;
		border: 1px solid rgba(255, 255, 255, 0.26);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		font-size: 11px;
		font-weight: 600;
		line-height: 1.2;
		text-align: left;
		overflow-wrap: anywhere;
		color: rgba(255, 255, 255, 0.84);
	}

	.annotation {
		opacity: 0.75;
		font-size: 14px;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.6);
	}
</style>
