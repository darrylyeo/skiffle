<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Functions
	import { counterPrimeFactorization } from './counter-frame'

	const counterAeaBars = (count: number) => (
		Array.from(
			{
				length: 18,
			},
			(_, i) => ({
				height: 18 + ((count * 7 + i * 19) % 62),
				opacity: 0.16 + (((count + i * 13) % 5) * 0.08),
			}),
		)
	)

	// Props
	let { data }: { data: PageData } = $props()
</script>


<article class="page column">
	<div class="aea row" aria-hidden="true">
		{#each counterAeaBars(data.count) as bar, i (`${i}:${bar.height}`)}
			<span
				class="aea-bar"
				style={`height:${bar.height}%;opacity:${bar.opacity};`}
			></span>
		{/each}
	</div>

	<h2>How high can you go?</h2>

	<p
		class={[
			'value',
			String(data.count).length >= 4 && 'value--tight',
			String(data.count).length >= 6 && 'value--compact',
		]}
		aria-live="polite"
	>
		{data.count}
	</p>

	<p class="factors">{counterPrimeFactorization(data.count)}</p>
</article>


<style>
	.page {
		position: relative;
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

	.aea {
		position: absolute;
		top: 0.8em;
		right: 0.8em;
		bottom: 0.8em;
		left: 0.8em;
		align-items: flex-end;
		justify-content: center;
		gap: 0.38em;
		overflow: hidden;
	}

	.aea-bar {
		display: block;
		width: 1.05em;
		border-radius: 999px 999px 0 0;
		background:
			linear-gradient(180deg, rgba(255, 241, 224, 0.9), rgba(255, 129, 82, 0.52)),
			rgba(255, 255, 255, 0.08);
		box-shadow:
			0 0 1.4em rgba(255, 125, 82, 0.15),
			0 0 0.12em rgba(255, 255, 255, 0.3);
	}

	h2 {
		font-size: 1.45em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.value {
		font-size: 7.8em;
		font-weight: 900;
		letter-spacing: -0.1em;
		line-height: 1;
		color: #fff7f0;
		text-shadow:
			0 0.02em 0 rgba(255, 255, 255, 0.24),
			0 0.08em 0.18em rgba(0, 0, 0, 0.28),
			0 0.28em 0.5em rgba(255, 96, 46, 0.2);
	}

	.value--tight {
		font-size: 6.4em;
	}

	.value--compact {
		font-size: 5.3em;
	}

	.factors {
		font-size: 0.72em;
		letter-spacing: 0.02em;
		color: rgba(255, 232, 219, 0.74);
	}
</style>
