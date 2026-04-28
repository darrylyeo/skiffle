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

	const u = $derived(page.url)
	const displayHost = $derived(u.host.replace(/%2f/gi, '/'))
	const displayPath = $derived((
		u.pathname === '/' ?
			''
		:
			u.pathname.replace(/\/$/, '').replace(/%2f/gi, '/')
	))
	const displayQueryAndHash = $derived(`${u.search}${u.hash}`)
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
			<p class="url-wrap">
				<output class="url-badge">
					<span>{displayHost}</span>

					{#if displayPath}
						<span class="path-line">{displayPath}</span>
					{/if}

					{#if displayQueryAndHash}
						<span class="query-line">{displayQueryAndHash}</span>
					{/if}
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

	.url-wrap {
		flex: 1;
		min-width: 0;
		display: flex;
	}

	.url-badge {
		display: flex;
		flex-wrap: wrap;
		width: fit-content;
		max-width: 100%;
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

	.path-line {
		opacity: 0.8;
		word-break: break-all;
	}

	.query-line {
		font-size: 0.82em;
		opacity: 0.82;
		word-break: break-all;
	}

	.annotation {
		opacity: 0.75;
		font-size: 14px;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.6);
	}
</style>
