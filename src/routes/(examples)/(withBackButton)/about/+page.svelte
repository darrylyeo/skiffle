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
				<span>How do Frames and Snaps work in SKIFFLE?</span>
			{:else if data.currentPage === 2}
				<span>What's next for SKIFFLE?</span>
			{:else if data.currentPage === 3}
				<span>That's all, folks!</span>
			{/if}
		</h2>
	</header>

	<div class="card column">
		{#if data.currentPage === 0}
			<p><b>SKIFFLE</b> renders an entire website in a Farcaster Snap, extending <b>SvelteKit</b> to generate image previews from HTML, relative navigation "links" via <code>submit</code> actions, and Snap metadata.</p>

			<p>Load page data and render content as you normally would, using Svelte template syntax, <code>style</code> tags, <code>+layout.svelte</code> / <code>+page.svelte</code> components, and <code>load()</code> functions in <code>+layout.server.ts</code> / <code>+layout.ts</code> / <code>+page.server.ts</code> / <code>+page.ts</code> (or <code>.js</code>) files.</p>

			<p>Link snap buttons to routes using relative URLs, or handle signature packets<wbr> using <b>Form Actions</b> (define <code>actions</code> in <code>+page.server.ts</code>, then target <code>?/actionName</code>).</p>
		{:else if data.currentPage === 1}
			<p>To render a SvelteKit page as a snap, <b>export a <code>frame</code> object</b> from <code>+page.server.ts</code> or<wbr> <code>+page.ts</code> matching the <code>FrameMeta</code> type (also defined under the global <code>PageData</code> type).</p>

			<p><b>Page route URLs double as frame image URLs</b> and share common <code>load()</code> functions. This<wbr> overloading behavior is made possible by the <code>handle</code> server hook in <code>hooks.server.ts</code>.</p>

			<p><b>Farcaster Snaps</b> use the same URLs with <code>Accept: application/vnd.farcaster.snap+json</code>.<wbr> The hook returns JSON (<code>version</code>, <code>theme</code>, <code>ui</code>) per the <a href="https://docs.farcaster.xyz/snap">snap spec</a>.<wbr> Snap button <code>submit</code> actions POST a JFS-shaped body;<wbr> for local testing, use the <a href="https://farcaster.xyz/~/developers/snaps">snap emulator</a>.</p>

			<p>A page route request with an <code>Accept</code> HTTP header containing <code>image/</code> yields this pipeline:<wbr> compile Svelte to HTML/CSS, convert to SVG with <code>satori</code>, render to PNG with <code>resvg-js</code>.</p>
		{:else if data.currentPage === 2}
			<p>Try the SKIFFLE Snap demo – cast <b>snap.skiffle.dev</b> on your Farcaster client of choice!</p>

			<p>Check out SKIFFLE on GitHub – <b>github.com/darrylyeo/skiffle</b></p>

			<p>Follow <b>@darrylyeo</b> on Farcaster and GitHub for project updates.</p>
		{:else if data.currentPage === 3}
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

	p {
		font-size: 0.9em;
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
