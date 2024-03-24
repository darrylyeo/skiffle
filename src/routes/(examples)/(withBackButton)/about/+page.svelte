<article class="column">
	<header>
		<h2>What is SKIFFLE?</h2>
	</header>

	<div class="card column">
		<p><b>SKIFFLE</b> lets you render images for <b>Farcaster Frames</b> using <b>SvelteKit</b> routes and layouts.</p>

		<p>Load page data and render content as you normally would, using Svelte template syntax, <code>style</code> tags, <code>+layout.svelte</code> / <code>+page.svelte</code> components, and <code>load()</code> functions in <code>+layout.server.ts</code> / <code>+layout.ts</code> / <code>+page.server.ts</code> / <code>+page.ts</code> (or <code>.js</code>) files.</p>

		<p>Whenever a page route is requested with an <code>Accept</code> HTTP header containing <code>image/</code>,<wbr> its HTML page content will be rendered as an image using <code>satori</code> and <code>resvg-js</code>.</p>
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
		line-height: 1.75;
		align-items: flex-end;
		flex-wrap: wrap;
		column-gap: 0.2em;
		align-items: baseline;
	}
	p b {
		line-height: 1.66;
	}
	p code {
		line-height: 1.5;
		font-size: 0.85em;
		padding: 0.05em 0.4em;
		border-radius: 0.25em;
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
