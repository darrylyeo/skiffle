<script lang="ts">
	// Data
	let {
		data,
	} = $props()
</script>


<article class="column">
	<header>
		<h2>
			{#if data.currentPage === 0}
				<span>What is SKIFFLE?</span>

			{:else if data.currentPage === 1}
				<span>Layouts, pages, navigation and actions</span>

			{:else if data.currentPage === 2}
				<span>Snap-enabled pages</span>

			{:else if data.currentPage === 3}
				<span>Magic URL overloads</span>

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
			<p>Load page data and render content using regular HTML, Svelte templating syntax, <code>&lt;style&gt;</code> tags, and SvelteKit route components (<code>+layout.svelte</code> / <code>+page.svelte</code>) and <code>load()</code> functions (<code>+layout.server.ts</code> / <code>+layout.ts</code> / <code>+page.server.ts</code> / <code>+page.ts</code>).</p>

			<p>Link buttons to routes using relative URLs, or handle signature packets using <b>SvelteKit Form Actions</b> (define <code>actions</code> in <code>+page.server.ts</code> and set the target to <code>?/actionName</code>).</p>

		{:else if data.currentPage === 2}
			<p>To render any SvelteKit page as a Snap response, <b>return a <code>snap</code> object</b> from <code>load()</code> in <code>+page.server.ts</code> or <code>+page.ts</code>.</p>

			<p>Use provided helper functions to construct relative URL navigation buttons and Snap elements / configuration, including button groups, badges, and theme settings.</p>

			<p>The same route can also return <code>frame</code> metadata for image/post behavior, so Snap JSON and frame previews stay aligned while sharing the same route data.</p>

		{:else if data.currentPage === 3}
			<p>A snap-enabled page URL will return different responses depending on HTTP <code>Accept</code> headers:</p>

			<ul class="column">
				<li>
					<code>application/<wbr>vnd.<wbr>farcaster.<wbr>snap+json</code>: <span>Snap JSON response following the Farcaster Snap spec.</span>
				</li>

				<li>
					<code>image/*</code>: <span>PNG frame preview of the rendered page: Svelte to HTML/CSS to SVG via <code>satori</code>, then PNG via <code>resvg-js</code>.</span>
				</li>

				<li>
					<code>*/*</code>: <span>The normal HTML page rendered by SvelteKit.</span>
				</li>
			</ul>

		{:else if data.currentPage === 4}
			<p>Try the SKIFFLE Snap demo – cast <b>snap.skiffle.dev</b> from your Farcaster client of choice!</p>

			<p>Check out SKIFFLE on GitHub – <b>github.com/darrylyeo/skiffle</b></p>

			<p>Follow <b>@darrylyeo</b> on Farcaster and GitHub for project updates.</p>

		{:else if data.currentPage === 5}
			<span>You've reached the last page. Want to read it again?</span>
		{/if}
	</div>
</article>


<style>
	article {
		height: 100%;
		gap: 1.5em;
	}

	.card {
		justify-content: flex-start;
		flex: 1;

		padding: 1.25em;
		border-radius: 1em;
		background-color: rgba(255, 255, 255, 0.1);
		background-color: rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	p,
	p b {
		line-height: 1.75;
		align-items: flex-end;
		flex-wrap: wrap;
		column-gap: 0.2em;
		align-items: baseline;
	}
	p code {
		line-height: 1.6;
		font-size: 0.825em;
		padding: 0.05em 0.4em;
		border-radius: 0.25em;
		background-color: rgba(255, 255, 255, 0.1);
	}

	ul {
		gap: 0.75em;
		padding: 0;
		margin: 0;
	}

	ul > li {
		display: flex;
		flex-direction: column;
		gap: 0.35em;
		padding: 0.8em 0.9em;
		border-radius: 0.8em;
		background-color: rgba(255, 255, 255, 0.06);
		list-style: none;
		line-height: 1.5;
	}

	ul code {
		display: block;
		white-space: normal;
	}
</style>
