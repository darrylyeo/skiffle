<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Props
	let { data }: { data: PageData } = $props()
</script>


<article
	class={[
		'page',
		data.flips === 0 && 'page--fresh',
	]}
	data-face={data.face}
>
	<header>
		<p>Chance demo</p>
		<h1>Coin flip</h1>
		<p class="message" aria-live="polite">{data.message}</p>
	</header>

	<section class="stage" aria-label="Coin">
		<div class="coin">
			<span class="coin-mark">{data.face}</span>
		</div>
		{#if data.flips === 0}
			<p class="hint">Flip once to wake the coin - your streak starts here.</p>
		{/if}
	</section>

	<section class="scoreboard" aria-label="Heads and tails">
		<div class="tile" data-side="heads">
			<p>Heads</p>
			<p class="count">{data.heads}</p>
		</div>
		<div class="tile" data-side="tails">
			<p>Tails</p>
			<p class="count">{data.tails}</p>
		</div>
		<div class="meta">
			<p class="flips">
				<span class="flips-label">Total flips</span>
				<span class="flips-value">{data.flips}</span>
			</p>
		</div>
	</section>
</article>


<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-height: 100%;
		padding: 20px 22px 22px;
		border: 1px solid rgba(255, 233, 222, 0.12);
		border-radius: 30px;
		overflow: hidden;
		background:
			radial-gradient(circle at 18% 12%, rgba(255, 200, 112, 0.28), transparent 24%),
			radial-gradient(circle at 82% 16%, rgba(120, 168, 255, 0.26), transparent 26%),
			radial-gradient(circle at 50% 100%, rgba(255, 140, 90, 0.14), transparent 38%),
			linear-gradient(180deg, rgba(52, 28, 58, 0.62), rgba(28, 22, 48, 0.46));
		color: #f8fafc;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1em 2.5em rgba(28, 12, 52, 0.22);
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	header > p:first-child {
		margin: 0;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 226, 213, 0.88);
	}

	h1 {
		margin: 0;
		font-size: 40px;
		line-height: 1;
		font-weight: 800;
	}

	.message {
		margin: 0;
		font-size: 16px;
		line-height: 1.35;
		font-weight: 600;
		color: rgba(255, 244, 239, 0.94);
	}

	.stage {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 14px;
		flex: 1;
		min-height: 0;
		padding: 8px 0 4px;
	}

	.coin {
		display: flex;
		align-items: center;
		justify-content: center;
		width: min(88vw, 200px);
		height: min(88vw, 200px);
		border-radius: 999px;
		border: 3px solid rgba(255, 220, 160, 0.45);
		background:
			radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.55), transparent 42%),
			radial-gradient(circle at 70% 72%, rgba(255, 160, 72, 0.35), transparent 48%),
			linear-gradient(145deg, #ffe7a8 0%, #f0b850 38%, #c97820 100%);
		box-shadow:
			inset 0 2px 0 rgba(255, 255, 255, 0.35),
			0 16px 36px rgba(42, 18, 62, 0.35);
	}

	.page[data-face="T"] .coin {
		border-color: rgba(186, 210, 255, 0.5);
		background:
			radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.5), transparent 42%),
			radial-gradient(circle at 70% 72%, rgba(120, 170, 255, 0.38), transparent 48%),
			linear-gradient(145deg, #dbe8ff 0%, #8fb4ff 42%, #4a6ee0 100%);
	}

	.page[data-face="?"] .coin {
		border-color: rgba(230, 210, 255, 0.42);
		background:
			radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.42), transparent 44%),
			radial-gradient(circle at 70% 72%, rgba(200, 160, 255, 0.32), transparent 48%),
			linear-gradient(145deg, #f3e8ff 0%, #c4a5f5 45%, #7c5cbf 100%);
	}

	.coin-mark {
		font-size: clamp(64px, 22vw, 96px);
		font-weight: 900;
		line-height: 1;
		letter-spacing: -0.04em;
		color: rgba(62, 32, 12, 0.92);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
	}

	.page[data-face="T"] .coin-mark {
		color: rgba(24, 40, 92, 0.94);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
	}

	.page[data-face="?"] .coin-mark {
		color: rgba(48, 28, 78, 0.88);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.hint {
		margin: 0;
		max-width: 22em;
		text-align: center;
		font-size: 15px;
		line-height: 1.4;
		font-weight: 600;
		color: rgba(255, 228, 210, 0.78);
	}

	.scoreboard {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.scoreboard .tile {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 12px 14px;
		border-radius: 18px;
		border: 1px solid rgba(255, 224, 211, 0.14);
		background:
			radial-gradient(circle at left top, rgba(255, 198, 152, 0.14), transparent 28%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)),
			rgba(63, 28, 52, 0.32);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 10px 22px rgba(39, 17, 71, 0.18);
	}

	.scoreboard .tile > p:first-child {
		margin: 0;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 218, 198, 0.88);
	}

	.count {
		margin: 0;
		font-size: 32px;
		font-weight: 900;
		line-height: 1;
		color: #fff7f0;
		text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
	}

	.tile[data-side="tails"] .count {
		color: #eef4ff;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 10px 12px 12px;
		border-radius: 16px;
		border: 1px dashed rgba(255, 224, 211, 0.22);
		background: rgba(255, 255, 255, 0.04);
	}

	.flips {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin: 0;
	}

	.flips-label {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 218, 198, 0.72);
	}

	.flips-value {
		font-size: 20px;
		font-weight: 800;
		color: rgba(255, 248, 242, 0.95);
	}

	.page--fresh .tile[data-side="heads"] .count,
	.page--fresh .tile[data-side="tails"] .count {
		color: rgba(255, 236, 224, 0.45);
		text-shadow: none;
	}
</style>
