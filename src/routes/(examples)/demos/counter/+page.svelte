<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Functions
	import {
		counterPrimeFactorization,
		counterPrimeFactorTuples,
	} from './counter-frame'

	// Props
	let { data }: { data: PageData } = $props()

	const primeBars = $derived(counterPrimeFactorTuples(data.count))

	const factorBarHeightPct = (exp: number) => (
		Math.min(100, 26 + exp * 28)
	)

	/** Opacity pattern from the original decorative bar chart, keyed by bar index. */
	const factorBarOpacity = (count: number, index: number) => (
		0.16 + (((count + index * 13) % 5) * 0.08)
	)
</script>


<article class="page column">
	{#if primeBars.length}
		<div class="aea row" aria-hidden="true">
			{#each primeBars as { prime, exp }, i (`${prime}:${exp}`)}
				<span
					class="aea-bar"
					style={`height:${factorBarHeightPct(exp)}%;opacity:${factorBarOpacity(data.count, i)};`}
					title={`${prime}${exp > 1 ? `^${exp}` : ''}`}
				></span>
			{/each}
		</div>
	{/if}

	<div class="counter-body column">
		<p class="lead">The counter is</p>

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
	</div>
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
		justify-content: flex-start;
		gap: 0.38em;
		overflow: hidden;
	}

	.aea-bar {
		display: block;
		flex: 1 1 0;
		min-width: 0;
		width: auto;
		border-radius: 999px 999px 0 0;
		background:
			linear-gradient(180deg, rgba(255, 241, 224, 0.9), rgba(255, 129, 82, 0.52)),
			rgba(255, 255, 255, 0.08);
		box-shadow:
			0 0 1.4em rgba(255, 125, 82, 0.15),
			0 0 0.12em rgba(255, 255, 255, 0.3);
	}

	.counter-body {
		position: relative;
		z-index: 1;
		align-items: center;
		gap: 1.3em;
	}

	.lead {
		font-size: 1.5em;
		font-weight: 600;
		color: rgba(255, 240, 228, 0.82);
	}

	.value {
		font-size: 8.5em;
		font-weight: 900;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.1em;
		line-height: 1;
		color: #fff7f0;
		/* Single shadow only — multiple text-shadows crash Resvg after Satori */
		text-shadow: 0 0.08em 0.18em rgba(0, 0, 0, 0.35);
	}

	.value--tight {
		font-size: 6.4em;
	}

	.value--compact {
		font-size: 5.3em;
	}

	.factors {
		font-size: 2em;
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.02em;
		color: rgba(255, 232, 219, 0.74);
	}
</style>
