<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Props
	let { data }: { data: PageData } = $props()
</script>


<article class="column">
	<section class="panel column">
		<header class="column">
			<p class="eyebrow">SKIFFLE demo</p>

			<div class="meta row inline">
				<h2>Slideshow</h2>
				<p class="annotation">Slide {data.tipIndex + 1} of {data.tipCount}</p>
			</div>
		</header>

		<p class="message">{data.message}</p>

		<footer class="column">
			<div class="dots row inline" aria-hidden="true">
				{#each Array.from({ length: data.tipCount }) as _, index (`tip:${index}`)}
					<span data-active={index === data.tipIndex}></span>
				{/each}
			</div>
		</footer>
	</section>
</article>


<style>
	article {
		height: 100%;
		justify-content: center;
		padding: 0.2em 0.35em;
		border-radius: 1.65em;
		overflow: hidden;
		background:
			radial-gradient(circle at 10% 18%, rgba(255, 198, 147, 0.18), transparent 22%),
			radial-gradient(circle at 88% 12%, rgba(208, 179, 255, 0.2), transparent 26%),
			linear-gradient(180deg, rgba(74, 42, 86, 0.36), rgba(42, 21, 60, 0.16));
	}

	.panel {
		gap: 1.1em;
		padding: 1.2em 1.35em;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 1.45em;
		background:
			radial-gradient(circle at right top, rgba(255, 226, 192, 0.24), transparent 24%),
			radial-gradient(circle at left bottom, rgba(176, 140, 255, 0.14), transparent 28%),
			linear-gradient(135deg, rgba(255, 248, 242, 0.14), rgba(255, 255, 255, 0.05)),
			rgba(63, 30, 72, 0.34);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 0.95em 2.4em rgba(31, 11, 52, 0.18);
	}

	header.column {
		gap: 0.55em;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.72em;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 219, 199, 0.74);
	}

	.meta {
		justify-content: space-between;
		align-items: center;
		gap: 1em;
	}

	h2 {
		margin: 0;
		font-size: 1.35em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.annotation {
		margin: 0;
		flex-shrink: 0;
		font-size: 0.85em;
		font-weight: 600;
		color: rgba(255, 226, 213, 0.72);
	}

	.message {
		margin: 0;
		font-size: 1.15em;
		line-height: 1.5;
		font-weight: 500;
		color: rgba(255, 244, 239, 0.94);
		text-wrap: balance;
	}

	footer.column {
		gap: 0.4em;
	}

	.dots {
		justify-content: center;
		gap: 0.45em;
	}

	.dots > span {
		display: block;
		width: 0.45em;
		height: 0.45em;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.18);
	}

	.dots > span[data-active="true"] {
		width: 1.45em;
		background: rgba(255, 201, 166, 0.92);
	}
</style>
