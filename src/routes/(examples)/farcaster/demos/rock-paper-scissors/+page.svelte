<script lang='ts'>
	// Types/constants
	const CONFETTI = [
		{ x: '12%', y: '18%', r: '-14deg', color: '#fde047' },
		{ x: '22%', y: '10%', r: '10deg', color: '#fb7185' },
		{ x: '30%', y: '19%', r: '16deg', color: '#38bdf8' },
		{ x: '68%', y: '15%', r: '-10deg', color: '#facc15' },
		{ x: '78%', y: '9%', r: '15deg', color: '#34d399' },
		{ x: '86%', y: '17%', r: '-18deg', color: '#f472b6' },
	] as const

	type Props = {
		data: {
			rounds: number,
			wins: number,
			losses: number,
			draws: number,
			lastPlayer?: 'rock' | 'paper' | 'scissors',
			lastCpu?: 'rock' | 'paper' | 'scissors',
			outcome?: 'win' | 'loss' | 'draw',
			summary: string,
		},
	}


	// Props
	let { data }: Props = $props()
</script>


<article class='column' data-outcome={data.outcome}>
	{#if data.outcome === 'win'}
		<div class='confetti' aria-hidden='true'>
			{#each CONFETTI as piece (`${piece.x}:${piece.y}`)}
				<div
					class='piece'
					style:left={piece.x}
					style:top={piece.y}
					style:rotate={piece.r}
					style:background-color={piece.color}
				></div>
			{/each}
		</div>
	{/if}

	<header class='column'>
		<p class='eyebrow'>
			{
				data.outcome === 'win' ? 'You win'
				: data.outcome === 'loss' ? 'CPU wins'
				: data.outcome === 'draw' ? 'Draw'
				:
					'Best of instinct'
			}
		</p>
		<h2>Rock Paper Scissors</h2>
		<p class='annotation'>{data.summary}</p>
	</header>

	<section class='matchup'>
		<div class='choice column' data-role='player'>
			<span>You</span>
			<strong>{data.lastPlayer ?? '?'}</strong>
		</div>
		<div class='versus'>vs</div>
		<div class='choice column' data-role='cpu'>
			<span>CPU</span>
			<strong>{data.lastCpu ?? '?'}</strong>
		</div>
	</section>

	<section class='stats row'>
		<div class='metric column'>
			<span>Rounds</span>
			<strong>{data.rounds}</strong>
		</div>
		<div class='metric column'>
			<span>Wins</span>
			<strong>{data.wins}</strong>
		</div>
		<div class='metric column'>
			<span>Losses</span>
			<strong>{data.losses}</strong>
		</div>
		<div class='metric column'>
			<span>Draws</span>
			<strong>{data.draws}</strong>
		</div>
	</section>
</article>


<style>
	article {
		position: relative;
		height: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1.1em;
		padding: 0 0.35em;
		overflow: hidden;
	}

	header {
		gap: 0.35em;
	}

	.eyebrow {
		font-size: 0.78em;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.68);
	}

	h2 {
		font-size: 1.6em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.annotation {
		max-width: 25em;
		font-size: 0.92em;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.72);
	}

	.matchup {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75em;
	}

	.stats {
		display: flex;
		gap: 0.6em;
		justify-content: center;
	}

	.choice,
	.metric {
		min-width: 6em;
		padding: 0.75em 0.8em;
		gap: 0.25em;
		border-radius: 0.8em;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
			rgba(0, 0, 0, 0.18);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 0.5em 1.5em rgba(0, 0, 0, 0.15);
	}

	.choice > span,
	.metric > span {
		font-size: 0.78em;
		color: rgba(255, 255, 255, 0.68);
	}

	.choice > strong,
	.metric > strong {
		font-size: 1.3em;
		line-height: 1.1;
		color: rgba(255, 255, 255, 0.96);
	}

	.choice {
		min-width: 8.4em;
	}

	.choice > strong {
		font-size: 1.35em;
		text-transform: capitalize;
	}

	.choice[data-role="player"] {
		background:
			linear-gradient(180deg, rgba(56, 189, 248, 0.18), rgba(255, 255, 255, 0.03)),
			rgba(0, 0, 0, 0.18);
	}

	.choice[data-role="cpu"] {
		background:
			linear-gradient(180deg, rgba(251, 113, 133, 0.16), rgba(255, 255, 255, 0.03)),
			rgba(0, 0, 0, 0.18);
	}

	.versus {
		padding: 0.45em 0.7em;
		border-radius: 999px;
		font-size: 0.8em;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: rgba(0, 0, 0, 0.2);
		color: rgba(255, 255, 255, 0.75);
	}

	article[data-outcome="win"] .versus {
		background-color: rgba(34, 197, 94, 0.22);
		color: rgba(240, 253, 244, 0.95);
	}

	article[data-outcome="loss"] .versus {
		background-color: rgba(239, 68, 68, 0.22);
		color: rgba(254, 242, 242, 0.95);
	}

	article[data-outcome="draw"] .versus {
		background-color: rgba(255, 255, 255, 0.16);
	}

	.confetti {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.piece {
		position: absolute;
		width: 0.6em;
		height: 1.1em;
		border-radius: 999px;
		opacity: 0.85;
	}
</style>
