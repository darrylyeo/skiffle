<script lang="ts">
	// Data
	let {
		data,
	} = $props()

	let {
		currentPage,
	} = data
</script>


<article class="column">
	<header>
		<h2>
			{#if currentPage === 0}
				<span>What is SKIFFLE?</span>
			{:else if currentPage === 1}
				<span>How do I render a page as a frame with SKIFFLE?</span>
			{:else if currentPage === 2}
				<span>What's next for SKIFFLE?</span>
			{:else if currentPage === 3}
				<span>That's all, folks!</span>
			{/if}
		</h2>
	</header>

	<div class="card column">
		{#if currentPage === 0}
			<p><b>SKIFFLE</b> lets you render images for <b>Farcaster Frames</b> using <b>SvelteKit</b> routes and layouts.</p>

			<p>Load page data and render content as you normally would, using Svelte template syntax, <code>style</code> tags, <code>+layout.svelte</code> / <code>+page.svelte</code> components, and <code>load()</code> functions in <code>+layout.server.ts</code> / <code>+layout.ts</code> / <code>+page.server.ts</code> / <code>+page.ts</code> (or <code>.js</code>) files.</p>

			<p>Link frame buttons to other frame routes using relative URLs, or handle signature packets<wbr> using <b>Form Actions</b> (define <code>actions</code> in <code>+page.server.ts</code>, then target <code>?/actionName</code>).</p>
		{:else if currentPage === 1}
			<p>To render a SvelteKit page as a frame, <b>export a <code>frames</code> object</b> from <code>+page.server.ts</code> or<wbr> <code>+page.ts</code> matching the <code>FrameMeta</code> type (also defined under the global <code>PageData</code> type).</p>

			<p><b>Page route URLs double as frame image URLs</b> and share common <code>load()</code> functions. This<wbr> overloading behavior is made possible by the <code>handle</code> server hook in <code>hooks.server.ts</code>.</p>

			<p>A page route request with an <code>Accept</code> HTTP header containing <code>image/</code> yields this pipeline:<wbr> compile Svelte to HTML/CSS, convert to SVG with <code>satori</code>, render to PNG with <code>resvg-js</code>.</p>
		{:else if currentPage === 2}
			<p>Try the SKIFFLE demo – cast <b>skiffle.dev</b> on Warpcast or your Farcaster client of choice!</p>

			<p>Check out SKIFFLE on GitHub – <b>github.com/darrylyeo/skiffle</b></p>

			<p>Follow <b>@darrylyeo</b> on Farcaster and GitHub for project updates.</p>

			<p>More documentation and examples coming soon!</p>
		{:else if currentPage === 3}
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
</style>
