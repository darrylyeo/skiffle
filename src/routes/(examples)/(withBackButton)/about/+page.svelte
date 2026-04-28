<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Components
	import AbstractArtBackground from '$lib/AbstractArtBackground.svelte'

	// Functions
	import { abstractArtBackgroundView } from '$/routes/(examples)/art/abstract-art-frame'

	// Props
	let { data }: { data: PageData } = $props()

	// (Derived)
	let background = $derived(
		abstractArtBackgroundView(
			7301 + data.currentPage * 173,
			data.currentPage,
		)
	)
</script>


<article class={['column', data.currentPage === 3 && 'slide-magic-url']}>
	<AbstractArtBackground
		{background}
		inset="-10%"
		opacity={0.24}
	/>

	<header>
		<h2>
			{#if data.currentPage === 0}
				<span>What is SKIFFLE?</span>

			{:else if data.currentPage === 1}
				<span>Layouts, pages, navigation and actions</span>

			{:else if data.currentPage === 2}
				<span>Snap-enabled pages</span>

			{:else if data.currentPage === 3}
				<span>Magic URL overloads!</span>

			{:else if data.currentPage === 4}
				<span>What's next for SKIFFLE?</span>

			{:else if data.currentPage === 5}
				<span>That's all, folks!</span>
			{/if}
		</h2>
	</header>

	<div class="card column">
		{#if data.currentPage === 0}
			<p><b>SKIFFLE</b> is the easiest way to embed a full server-rendered website in a Farcaster Snap.</p>

			<p>It extends SvelteKit to render image previews from HTML, resolve metadata, generate Snap elements, and handle server actions and relative URL navigation.</p>

		{:else if data.currentPage === 1}
			<p>Load page data and render content using regular HTML, Svelte templating syntax, <code>‹style›</code> tags, and SvelteKit route components (<code>+layout.svelte</code> / <code>+page.svelte</code>) and <code>load()</code> functions (<code>+layout.server.ts</code> / <code>+layout.ts</code> / <code>+page.server.ts</code> / <code>+page.ts</code>).</p>

			<p>Link buttons to routes using relative URLs, or handle signature packets using <b>SvelteKit Form Actions</b> (define <code>actions</code> in <code>+page.server.ts</code> and set the target to <code>?/actionName</code>).</p>

		{:else if data.currentPage === 2}
			<p>To render any SvelteKit page as a Snap response, <b>return a <code>snap</code> object</b> from <code>load()</code> in <code>+page.server.ts</code> or <code>+page.ts</code>.</p>

			<p>Use the provided helper functions to construct responses for Snap elements and configuration, including relative URL navigation buttons, button groups, badges, and theme settings.</p>

			<p>Legacy Farcaster Frames v1 metadata is also supported via <code>frame</code>.</p>

		{:else if data.currentPage === 3}
			<p>
				A snap-enabled page URL returns different responses depending on HTTP <code>Accept</code> headers:
			</p>

			<p>
				<code>application/vnd.farcaster.snap+json</code>: Snap JSON response (following Farcaster Snap spec)
			</p>

			<p>
				<code>image/*</code>: PNG image of the rendered webpage contents
				<br>
				<span>Pipeline: Svelte › HTML/CSS › SVG (via <code>satori</code>) › PNG (via <code>resvg-js</code>)</span>
			</p>

			<p><code>*/*</code>: The normal HTML page rendered by SvelteKit.</p>

			<p>This is handled by the global SvelteKit <code>handle()</code> middleware in <code>hooks.server.ts</code>.</p>

		{:else if data.currentPage === 4}
			<p>Try the SKIFFLE Snap demo – cast <b>snap.skiffle.dev</b> from your Farcaster client of choice!</p>

			<p>Check out SKIFFLE on GitHub – <b>github.com/darrylyeo/skiffle</b></p>

			<p>Follow <b>@darrylyeo</b> on Farcaster, X and GitHub for project updates.</p>

		{:else if data.currentPage === 5}
			<span>You've reached the last page. Want to read it again?</span>
		{/if}
	</div>
</article>


<style>
	article {
		position: relative;
		height: 100%;
		gap: 1.5em;
		overflow: hidden;
	}

	header {
		position: relative;
	}

	.card {
		position: relative;
		justify-content: flex-start;
		flex: 1;
		gap: 2rem;

		padding: 1.25em;
		border-radius: 1em;
		background-color: rgba(0, 0, 0, 0.1);
	}

	p {
		display: flex;
		flex-wrap: wrap;
		font-size: 0.95em;
	}

	p,
	p b {
		line-height: 1.75;
		align-items: flex-end;
		flex-wrap: wrap;
		column-gap: 0.2em;
		align-items: baseline;
	}

	code {
		display: flex;
		line-height: 1.6;
		font-size: 0.825em;
		padding: 0.05em 0.4em;
		border-radius: 0.25em;
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
