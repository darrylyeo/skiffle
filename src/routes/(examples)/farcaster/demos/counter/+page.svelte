<script lang="ts">
	// Props
	let {
		data,
	}: {
		data: { count: number },
	} = $props()
</script>


<article class="column">
	<header>
		<h2>Counter demo</h2>
		<p class="annotation">Stateful frame — count lives in the image URL query and updates via POST actions.</p>
	</header>

	<p class="value" aria-live="polite">{data.count}</p>
</article>


<style>
	article {
		height: 100%;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.6em;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1em;
		padding: 1.6em 1.4em;
		overflow: hidden;
		background:
			radial-gradient(circle at 50% 62%, rgba(255, 210, 153, 0.24), transparent 24%),
			radial-gradient(circle at 18% 18%, rgba(255, 126, 72, 0.26), transparent 22%),
			radial-gradient(circle at 84% 14%, rgba(255, 101, 148, 0.18), transparent 24%),
			linear-gradient(180deg, rgba(82, 33, 52, 0.58), rgba(47, 21, 38, 0.4));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1.1em 2.6em rgba(37, 13, 62, 0.22);
	}

	header {
		gap: 0.35em;
	}

	h2 {
		font-size: 1.35em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.annotation {
		font-size: 0.9em;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
		max-width: 28em;
		line-height: 1.35;
	}

	.value {
		font-size: 4.5em;
		font-weight: 900;
		letter-spacing: -0.04em;
		line-height: 1;
		color: rgba(255, 255, 255, 0.98);
		text-shadow: 0 0.08em 0.2em rgba(0, 0, 0, 0.35);
	}
</style>
