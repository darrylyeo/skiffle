<script lang="ts">
	// Props
	let {
		data,
	}: {
		data: { message: string, tipCount: number, tipIndex: number },
	} = $props()
</script>


<article class="column">
	<header>
		<h2>Tip carousel</h2>
		<p class="annotation">Tip {data.tipIndex + 1} of {data.tipCount} · frame-only navigation</p>
	</header>

	<p class="message">{data.message}</p>
</article>


<style>
	article {
		height: 100%;
		justify-content: center;
		gap: 1.25em;
		padding: 0 0.5em;
	}

	header {
		gap: 0.35em;
		text-align: center;
	}

	h2 {
		font-size: 1.35em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.annotation {
		font-size: 0.85em;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.65);
	}

	.message {
		font-size: 1.15em;
		line-height: 1.55;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.88);
		text-align: center;
		max-width: 32em;
		margin-inline: auto;
	}
</style>
