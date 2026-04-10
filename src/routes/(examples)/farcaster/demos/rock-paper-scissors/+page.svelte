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
		width: 100%;
		height: 100%;
		border: 1px solid rgba(255, 232, 223, 0.12);
		border-radius: 1.7em;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1.25em;
		padding: 0.7em 0.65em 0.85em;
		overflow: hidden;
		background:
			radial-gradient(circle at 16% 50%, rgba(255, 127, 79, 0.26), transparent 24%),
			radial-gradient(circle at 84% 42%, rgba(82, 168, 255, 0.24), transparent 26%),
			radial-gradient(circle at 50% 10%, rgba(255, 236, 210, 0.08), transparent 20%),
			linear-gradient(180deg, rgba(35, 34, 73, 0.6), rgba(26, 24, 53, 0.4));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1em 2.4em rgba(31, 11, 52, 0.18);
	}

	header {
		gap: 0.45em;
	}

	.eyebrow {
		font-size: 0.84em;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 228, 216, 0.8);
	}

	h2 {
		font-size: 1.88em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.annotation {
		max-width: 18em;
		font-size: 1em;
		line-height: 1.35;
		color: rgba(255, 241, 234, 0.78);
	}

	.matchup {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.95em;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75em;
		justify-content: center;
		width: 100%;
		max-width: 20em;
	}

	.choice,
	.metric {
		min-width: 6.8em;
		padding: 0.95em 1em;
		gap: 0.35em;
		border-radius: 0.95em;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)),
			rgba(54, 20, 94, 0.32);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 0.8em 1.8em rgba(48, 17, 82, 0.22);
		border: 1px solid rgba(255, 232, 223, 0.12);
	}

	.metric {
		flex: 0 0 48%;
		max-width: 48%;
		min-width: 0;
	}

	.choice > span,
	.metric > span {
		font-size: 0.82em;
		color: rgba(255, 232, 223, 0.74);
	}

	.choice > strong,
	.metric > strong {
		font-size: 1.48em;
		line-height: 1.1;
		color: rgba(255, 255, 255, 0.96);
	}

	.choice {
		min-width: 9.1em;
	}

	.choice > strong {
		font-size: 1.75em;
		text-transform: capitalize;
	}

	.choice[data-role="player"] {
		background:
			linear-gradient(180deg, rgba(255, 154, 88, 0.24), rgba(255, 255, 255, 0.05)),
			rgba(69, 28, 117, 0.32);
	}

	.choice[data-role="cpu"] {
		background:
			linear-gradient(180deg, rgba(170, 123, 255, 0.22), rgba(255, 255, 255, 0.05)),
			rgba(69, 28, 117, 0.32);
	}

	.versus {
		padding: 0.55em 0.8em;
		border-radius: 999px;
		font-size: 0.88em;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		background-color: rgba(67, 27, 114, 0.42);
		color: rgba(255, 241, 234, 0.82);
		border: 1px solid rgba(255, 232, 223, 0.12);
	}

	article[data-outcome="win"] .versus {
		background-color: rgba(255, 106, 47, 0.34);
		color: rgba(255, 245, 239, 0.96);
	}

	article[data-outcome="loss"] .versus {
		background-color: rgba(118, 70, 186, 0.34);
		color: rgba(247, 241, 255, 0.96);
	}

	article[data-outcome="draw"] .versus {
		background-color: rgba(83, 41, 138, 0.38);
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
