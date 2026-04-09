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
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1em;
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
