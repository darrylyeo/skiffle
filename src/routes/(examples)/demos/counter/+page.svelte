<script lang="ts">
	// Props
	let {
		data,
	}: {
		data: { count: number },
	} = $props()
</script>


<article class="column">
	<header class="column">
		<p class="eyebrow">Counter demo</p>
		<h2>Tap it up</h2>
	</header>

	<div class="meter column">
		<p class="annotation">Current count</p>
		<p class="value" aria-live="polite">{data.count}</p>
	</div>
</article>


<style>
	article {
		height: 100%;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.6em;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1.3em;
		padding: 1.3em 1.2em 1.45em;
		overflow: hidden;
		background:
			radial-gradient(circle at 50% 72%, rgba(255, 214, 154, 0.22), transparent 28%),
			radial-gradient(circle at 16% 18%, rgba(255, 126, 72, 0.28), transparent 22%),
			radial-gradient(circle at 84% 14%, rgba(255, 101, 148, 0.22), transparent 24%),
			radial-gradient(circle at 50% 14%, rgba(255, 244, 222, 0.08), transparent 18%),
			linear-gradient(180deg, rgba(82, 33, 52, 0.58), rgba(47, 21, 38, 0.4));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1.1em 2.6em rgba(37, 13, 62, 0.22);
	}

	header {
		gap: 0.2em;
	}

	.eyebrow {
		font-size: 0.78em;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(255, 221, 200, 0.78);
	}

	h2 {
		font-size: 1.7em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.meter {
		position: relative;
		min-width: min(100%, 20em);
		padding: 1em 1em 1.15em;
		border: 1px solid rgba(255, 235, 224, 0.14);
		border-radius: 1.7em;
		gap: 0.25em;
		background:
			radial-gradient(circle at 50% 36%, rgba(255, 247, 232, 0.2), transparent 30%),
			radial-gradient(circle at 50% 85%, rgba(255, 110, 61, 0.18), transparent 40%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)),
			rgba(70, 26, 56, 0.34);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			0 1.1em 2.4em rgba(37, 13, 62, 0.18);
	}

	.annotation {
		font-size: 0.84em;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 226, 210, 0.66);
	}

	.value {
		font-size: clamp(4.8em, 18vw, 6.8em);
		font-weight: 900;
		letter-spacing: -0.08em;
		line-height: 1;
		color: #fff7f0;
		text-shadow:
			0 0.02em 0 rgba(255, 255, 255, 0.24),
			0 0.08em 0.18em rgba(0, 0, 0, 0.28),
			0 0.28em 0.5em rgba(255, 96, 46, 0.2);
	}
</style>
