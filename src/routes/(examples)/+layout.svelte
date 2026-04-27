<script lang="ts">
	// Types
	import type { Snippet } from 'svelte'
	import type { PageData } from './$types'

	// Context
	import { page } from '$app/state'


	// Props
	let {
		children,
		data,
	}: {
		children: Snippet,
		data: PageData,
	} = $props()

	const u = $derived((() => {
		const out = new URL(page.url.href)
		for (let i = 0; i < 10; i++) {
			const s = out.search
			const h = out.hash
			if (!s.includes('&amp;') && !h.includes('&amp;')) {
				break
			}
			if (s.includes('&amp;')) {
				out.search = s.replaceAll('&amp;', '&')
			}
			if (h.includes('&amp;')) {
				out.hash = h.replaceAll('&amp;', '&')
			}
		}
		return out
	})())
	const displayUrl = $derived(u.href)
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
					<span class="url-line">{displayUrl.replace(/%2f/gi, '/')}</span>
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
	}

	main > :global(:only-child) {
		flex: 1;
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

	.url-badge > span {
		display: block;
	}

	.url-line {
		font-size: 0.82em;
		opacity: 0.9;
		word-break: break-all;
	}

	.annotation {
		opacity: 0.75;
		font-size: 14px;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.6);
	}
</style>
