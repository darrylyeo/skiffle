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
	<div class="background" aria-hidden="true">
		{#each Array.from({ length: Math.max(10, Math.min(20, data.historyBadges.length + 8)) }) as _, i (`spark:${i}`)}
			<span
				class="spark"
				style={`left:${(i * 17 + data.flips * 7) % 100}%;top:${(i * 13 + data.heads * 9 + data.tails * 5 + data.edge * 11) % 100}%;width:${48 + ((i * 29 + data.flips * 3) % 96)}px;height:${48 + ((i * 31 + data.flips * 5) % 96)}px;opacity:${0.12 + ((i + data.flips) % 5) * 0.04};`}
			></span>
		{/each}
	</div>

	<header class="column">
		<div class="title row inline">
			<h1>Coin flip</h1>
			<p class="flips">{data.flips} flips</p>
		</div>

		<p class="message" aria-live="polite">{data.message}</p>
	</header>

	<section class="hero column" aria-label="Coin">
		<div class="coin-shell">
			<div class="coin">
				<span class="coin-mark">{data.face}</span>
			</div>
		</div>
	</section>

	<section class="stats row" aria-label="Heads and tails">
		<div class="tile column" data-side="heads">
			<p>Heads</p>
			<p class="count">{data.heads}</p>
		</div>

		<div class="tile column" data-side="tails">
			<p>Tails</p>
			<p class="count">{data.tails}</p>
		</div>

		{#if data.hasEdge}
			<div class="tile column" data-side="edge">
				<p>Edge</p>
				<p class="count">{data.edge}</p>
			</div>
		{/if}
	</section>

	<section class="history column" aria-label="Last 16 flips">
		<div class="title row inline">
			<h2>Last 16</h2>
			{#if data.historyBadges.length > 0}
				<p class="history-count">{data.historyBadges.length}</p>
			{/if}
		</div>

		<div class="badges">
			{#if data.historyBadges.length > 0}
				{#each data.historyBadges as badge (badge.id)}
					<span class="history-badge" data-result={badge.result}>{badge.short}</span>
				{/each}
			{:else}
				<p class="empty">No flips yet</p>
			{/if}
		</div>
	</section>
</article>


<style>
	.page {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 1em;
		height: 100%;
		padding: 1.2em 1.2em 1.15em;
		border: 1px solid rgba(255, 233, 222, 0.14);
		border-radius: 1.9em;
		overflow: hidden;
		background:
			radial-gradient(circle at 18% 12%, rgba(255, 200, 112, 0.32), transparent 24%),
			radial-gradient(circle at 82% 16%, rgba(120, 168, 255, 0.3), transparent 26%),
			radial-gradient(circle at 50% 100%, rgba(255, 140, 90, 0.18), transparent 38%),
			linear-gradient(180deg, rgba(52, 28, 58, 0.72), rgba(20, 18, 42, 0.58));
		color: #f8fafc;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1em 2.5em rgba(28, 12, 52, 0.22);
	}

	.background {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.spark {
		position: absolute;
		border-radius: 999px;
		background:
			radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.4), transparent 38%),
			radial-gradient(circle, rgba(255, 196, 116, 0.34), transparent 72%);
		filter: blur(10px);
		transform: translate(-50%, -50%);
	}

	.page[data-face="T"] .spark {
		background:
			radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.36), transparent 38%),
			radial-gradient(circle, rgba(122, 170, 255, 0.34), transparent 72%);
	}

	.page[data-face="E"] .spark,
	.page[data-face="?"] .spark {
		background:
			radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.34), transparent 38%),
			radial-gradient(circle, rgba(224, 140, 255, 0.3), transparent 72%);
	}

	header.column,
	.hero.column,
	.history.column {
		position: relative;
		width: 100%;
	}

	.stats.row {
		position: relative;
		width: 100%;
	}

	.title {
		justify-content: space-between;
		align-items: flex-end;
		gap: 0.75em;
	}

	h1,
	h2,
	.flips,
	.history-count,
	.message,
	.badges,
	.empty {
		margin: 0;
	}

	h1 {
		font-size: 2.5em;
		line-height: 1;
		font-weight: 800;
	}

	h2 {
		font-size: 1em;
		line-height: 1;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 228, 214, 0.78);
	}

	.flips,
	.history-count {
		padding: 0.28em 0.62em;
		border: 1px solid rgba(255, 236, 224, 0.14);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		font-size: 0.84em;
		font-weight: 700;
		color: rgba(255, 240, 232, 0.82);
	}

	.message {
		max-width: 19em;
		font-size: 1.02em;
		line-height: 1.35;
		font-weight: 600;
		color: rgba(255, 244, 239, 0.94);
	}

	.hero {
		align-items: center;
		justify-content: center;
		flex: 1;
		min-height: 0;
		padding: 0.15em 0 0.25em;
	}

	.coin-shell {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18.5em;
		height: 18.5em;
		max-width: 100%;
		max-height: 100%;
		border-radius: 999px;
		background:
			radial-gradient(circle, rgba(255, 255, 255, 0.16), transparent 54%),
			radial-gradient(circle, rgba(255, 176, 74, 0.18), transparent 68%);
		box-shadow:
			0 0 3.4em rgba(255, 175, 66, 0.16),
			inset 0 0 2.4em rgba(255, 255, 255, 0.04);
	}

	.page[data-face="T"] .coin-shell {
		background:
			radial-gradient(circle, rgba(255, 255, 255, 0.14), transparent 54%),
			radial-gradient(circle, rgba(102, 162, 255, 0.2), transparent 68%);
		box-shadow:
			0 0 3.4em rgba(102, 162, 255, 0.18),
			inset 0 0 2.4em rgba(255, 255, 255, 0.04);
	}

	.page[data-face="E"] .coin-shell,
	.page[data-face="?"] .coin-shell {
		background:
			radial-gradient(circle, rgba(255, 255, 255, 0.14), transparent 54%),
			radial-gradient(circle, rgba(205, 124, 255, 0.18), transparent 68%);
		box-shadow:
			0 0 3.4em rgba(205, 124, 255, 0.18),
			inset 0 0 2.4em rgba(255, 255, 255, 0.04);
	}

	.coin {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 14.8em;
		height: 14.8em;
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

	.page[data-face="E"] .coin {
		border-color: rgba(246, 180, 255, 0.5);
		background:
			radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.5), transparent 42%),
			radial-gradient(circle at 70% 72%, rgba(255, 134, 232, 0.34), transparent 48%),
			linear-gradient(145deg, #ffe7ff 0%, #ef9cff 42%, #a548cd 100%);
	}

	.coin-mark {
		font-size: 8.25em;
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

	.page[data-face="?"] .coin-mark,
	.page[data-face="E"] .coin-mark {
		color: rgba(48, 28, 78, 0.88);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.stats {
		gap: 0.65em;
		flex-wrap: nowrap;
		flex-shrink: 0;
	}

	.tile {
		display: flex;
		flex: 1;
		gap: 0.45em;
		padding: 0.8em 0.9em 0.88em;
		border-radius: 1.1em;
		border: 1px solid rgba(255, 224, 211, 0.14);
		background:
			radial-gradient(circle at left top, rgba(255, 198, 152, 0.14), transparent 28%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)),
			rgba(63, 28, 52, 0.32);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 10px 22px rgba(39, 17, 71, 0.18);
	}

	.tile > p:first-child {
		margin: 0;
		font-size: 0.8em;
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

	.tile[data-side="edge"] .count {
		color: #ffe9ff;
	}

	.history {
		justify-content: flex-start;
		gap: 0.65em;
		flex-shrink: 0;
		padding: 0.85em 0.95em 0.95em;
		border-radius: 1.2em;
		border: 1px solid rgba(255, 228, 216, 0.14);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
			rgba(33, 22, 58, 0.28);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45em;
		align-content: flex-start;
		width: 100%;
	}

	.history-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2.1em;
		padding: 0.45em 0.62em;
		border-radius: 999px;
		border: 1px solid rgba(255, 238, 230, 0.14);
		background:
			linear-gradient(180deg, rgba(255, 246, 228, 0.2), rgba(255, 255, 255, 0.04)),
			rgba(255, 174, 72, 0.22);
		font-size: 0.9em;
		font-weight: 800;
		color: #fff7f0;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 0.5em 1.2em rgba(18, 10, 32, 0.12);
	}

	.history-badge[data-result="tails"] {
		background:
			linear-gradient(180deg, rgba(233, 244, 255, 0.2), rgba(255, 255, 255, 0.04)),
			rgba(110, 158, 255, 0.22);
	}

	.history-badge[data-result="edge"] {
		background:
			linear-gradient(180deg, rgba(255, 232, 255, 0.22), rgba(255, 255, 255, 0.04)),
			rgba(216, 118, 255, 0.22);
	}

	.empty {
		font-size: 0.92em;
		font-weight: 600;
		color: rgba(255, 230, 220, 0.62);
	}
</style>
