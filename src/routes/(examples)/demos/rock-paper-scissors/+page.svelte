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

	const MOVE = {
		rock: { glyph: '✊', name: 'Rock' },
		paper: { glyph: '✋', name: 'Paper' },
		scissors: { glyph: '✌️', name: 'Scissors' },
	} as const

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


	// (Derived)
	const playerPick = $derived(( data.lastPlayer ? MOVE[data.lastPlayer] : null ))
	const cpuPick = $derived(( data.lastCpu ? MOVE[data.lastCpu] : null ))
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
		<h2>
			<div class='title-main'>Rock Paper Scissors</div>
		</h2>
		<p class='annotation'>{data.summary}</p>
	</header>

	<section class='matchup' aria-label='Last round'>
		<div class='choice column' data-role='player'>
			<p class='contestant'>You</p>
			<p class='glyph'>{playerPick?.glyph ?? '❔'}</p>
			<strong class='move'>{playerPick?.name ?? '?'}</strong>
		</div>
		<p class='versus'>
			<strong class='versus-inner'>VS</strong>
		</p>
		<div class='choice column' data-role='cpu'>
			<p class='contestant'>CPU</p>
			<p class='glyph'>{cpuPick?.glyph ?? '❔'}</p>
			<strong class='move'>{cpuPick?.name ?? '?'}</strong>
		</div>
	</section>

	<section class='stats row' aria-label='Scoreboard'>
		<div class='metric column'>
			<p>Rounds</p>
			<strong>{data.rounds}</strong>
		</div>
		<div class='metric column'>
			<p>Wins</p>
			<strong>{data.wins}</strong>
		</div>
		<div class='metric column'>
			<p>Losses</p>
			<strong>{data.losses}</strong>
		</div>
		<div class='metric column'>
			<p>Draws</p>
			<strong>{data.draws}</strong>
		</div>
	</section>
</article>


<style>
	@keyframes duel-pop {
		from {
			transform: scale(0.94);
			filter: brightness(1);
		}
		55% {
			transform: scale(1.06);
			filter: brightness(1.2);
		}
		to {
			transform: scale(1);
			filter: brightness(1);
		}
	}

	article {
		position: relative;
		width: 100%;
		height: 100%;
		border: 2px solid rgba(255, 210, 120, 0.35);
		border-radius: 1.4em;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1.5em;
		padding: 1.1em 0.85em 1.15em;
		overflow: hidden;
		background:
			radial-gradient(circle at 20% 16%, rgba(255, 186, 56, 0.28), transparent 24%),
			radial-gradient(circle at 82% 14%, rgba(141, 99, 255, 0.3), transparent 26%),
			radial-gradient(circle at 50% 100%, rgba(255, 186, 56, 0.14), transparent 38%),
			linear-gradient(180deg, rgba(28, 14, 58, 0.98), rgba(18, 10, 40, 0.98));
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			inset 0 -2em 3em rgba(0, 0, 0, 0.35),
			0 0 2.4em rgba(255, 196, 72, 0.34),
			0 1.2em 2.8em rgba(8, 0, 24, 0.55);
	}

	article[data-outcome="win"] {
		border-color: rgba(255, 168, 112, 0.42);
		background:
			radial-gradient(circle at 20% 16%, rgba(255, 139, 77, 0.3), transparent 24%),
			radial-gradient(circle at 82% 14%, rgba(52, 211, 153, 0.28), transparent 26%),
			radial-gradient(circle at 50% 100%, rgba(255, 139, 77, 0.16), transparent 38%),
			linear-gradient(180deg, rgba(28, 14, 58, 0.98), rgba(18, 10, 40, 0.98));
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			inset 0 -2em 3em rgba(0, 0, 0, 0.35),
			0 0 2.4em rgba(255, 136, 77, 0.3),
			0 1.2em 2.8em rgba(8, 0, 24, 0.55);
	}

	article[data-outcome="loss"] {
		border-color: rgba(180, 160, 255, 0.34);
		background:
			radial-gradient(circle at 20% 16%, rgba(141, 99, 255, 0.26), transparent 24%),
			radial-gradient(circle at 82% 14%, rgba(96, 165, 250, 0.28), transparent 26%),
			radial-gradient(circle at 50% 100%, rgba(141, 99, 255, 0.12), transparent 38%),
			linear-gradient(180deg, rgba(28, 14, 58, 0.98), rgba(18, 10, 40, 0.98));
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			inset 0 -2em 3em rgba(0, 0, 0, 0.35),
			0 0 2.4em rgba(122, 99, 255, 0.3),
			0 1.2em 2.8em rgba(8, 0, 24, 0.55);
	}

	article[data-outcome="draw"] {
		border-color: rgba(180, 210, 255, 0.32);
		background:
			radial-gradient(circle at 20% 16%, rgba(125, 211, 252, 0.24), transparent 24%),
			radial-gradient(circle at 82% 14%, rgba(192, 132, 252, 0.24), transparent 26%),
			radial-gradient(circle at 50% 100%, rgba(125, 211, 252, 0.1), transparent 38%),
			linear-gradient(180deg, rgba(28, 14, 58, 0.98), rgba(18, 10, 40, 0.98));
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.1),
			inset 0 -2em 3em rgba(0, 0, 0, 0.35),
			0 0 2.4em rgba(125, 211, 252, 0.24),
			0 1.2em 2.8em rgba(8, 0, 24, 0.55);
	}

	header {
		gap: 0.55em;
	}

	h2 {
		margin: 0;
		font-size: clamp(1.65rem, 5.2vw, 2.65rem);
		font-weight: 900;
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: #fff;
		text-shadow:
			0 0.06em 0 rgba(120, 40, 180, 0.9),
			0 0.12em 0 rgba(40, 10, 80, 0.85),
			0 0 0.45em rgba(255, 120, 200, 0.35);
	}

	.title-main {
		display: block;
		padding: 0.08em 0.2em;
		border-radius: 0.15em;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 0 1.6em rgba(255, 196, 72, 0.34);
	}

	.annotation {
		max-width: 22em;
		font-size: 1.12em;
		line-height: 1.4;
		color: rgba(255, 236, 220, 0.82);
	}

	.matchup {
		position: relative;
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		max-width: 26em;
		padding: 0.5em 0;
		border-radius: 1.2em;
		border: 2px dashed rgba(255, 220, 160, 0.2);
		box-shadow: inset 0 0 2.2em rgba(141, 99, 255, 0.08);
	}

	.stats {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		gap: 0.85em;
		justify-content: center;
		width: 100%;
		max-width: 22em;
	}

	.choice,
	.metric {
		flex: 1 1 auto;
		min-width: 6.8em;
		padding: 1.05em 1.05em 1.15em;
		gap: 0.45em;
		border-radius: 1em;
		background:
			linear-gradient(180deg, rgba(255, 186, 56, 0.12), rgba(255, 255, 255, 0.03)),
			rgba(48, 20, 86, 0.76);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.18),
			0 0 1.2em rgba(255, 186, 56, 0.14),
			0 0.35em 0 rgba(0, 0, 0, 0.35),
			0 1em 2em rgba(48, 12, 90, 0.45);
		border: 1px solid rgba(255, 220, 160, 0.2);
	}

	.metric {
		flex: 0 0 47%;
		max-width: 47%;
		min-width: 0;
		padding: 0.85em 0.75em;
	}

	.contestant {
		font-size: 0.92em;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 220, 200, 0.78);
	}

	.glyph {
		display: block;
		font-size: clamp(4.1rem, 19vw, 6.7rem);
		line-height: 1;
		filter:
			drop-shadow(0 0.12em 0.08em rgba(0, 0, 0, 0.45))
			drop-shadow(0 0 0.45em rgba(255, 186, 56, 0.28));
	}

	.move,
	.metric > strong {
		font-size: clamp(1.35rem, 4.5vw, 1.85rem);
		font-weight: 800;
		line-height: 1.1;
		color: rgba(255, 255, 255, 0.98);
		text-transform: capitalize;
		text-shadow: 0 0.08em 0.15em rgba(0, 0, 0, 0.4);
	}

	.metric > strong {
		font-size: clamp(1.5rem, 5vw, 2.1rem);
		font-variant-numeric: tabular-nums;
		font-family: ui-monospace, 'Cascadia Code', monospace;
		color: rgba(255, 248, 120, 0.98);
		text-shadow:
			0 0 0.4em rgba(255, 220, 80, 0.5),
			0 0.06em 0 rgba(80, 40, 0, 0.5);
	}

	.choice {
		flex: 1 1 42%;
		min-width: 8.5em;
		justify-content: center;
	}

	.choice[data-role="player"] {
		background:
			linear-gradient(180deg, rgba(255, 171, 112, 0.18), rgba(255, 255, 255, 0.03)),
			rgba(112, 46, 95, 0.82);
		border-color: rgba(255, 210, 120, 0.35);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.18),
			0 0 1.4em rgba(255, 186, 56, 0.14),
			0 0.35em 0 rgba(0, 0, 0, 0.35),
			0 1em 2em rgba(48, 12, 90, 0.45);
	}

	.choice[data-role="cpu"] {
		background:
			linear-gradient(180deg, rgba(141, 99, 255, 0.2), rgba(255, 255, 255, 0.03)),
			rgba(76, 44, 129, 0.84);
		border-color: rgba(255, 220, 160, 0.2);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.18),
			0 0 1.4em rgba(141, 99, 255, 0.3),
			0 0.35em 0 rgba(0, 0, 0, 0.35),
			0 1em 2em rgba(48, 12, 90, 0.45);
	}

	article[data-outcome="win"] > section.matchup > .choice[data-role="player"] {
		animation: duel-pop 0.7s cubic-bezier(0.34, 1.45, 0.64, 1);
	}

	article[data-outcome="loss"] > section.matchup > .choice[data-role="cpu"] {
		animation: duel-pop 0.7s cubic-bezier(0.34, 1.45, 0.64, 1);
	}

	article[data-outcome="draw"] > section.matchup > .choice {
		animation: duel-pop 0.55s cubic-bezier(0.34, 1.45, 0.64, 1);
	}

	.versus {
		margin: 0;
		align-self: center;
		flex-shrink: 0;
	}

	.versus-inner {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 3.2em;
		min-height: 3.2em;
		padding: 0.4em 0.55em;
		border-radius: 0.35em;
		transform: rotate(-8deg) skewX(-4deg);
		font-size: clamp(1.05rem, 3.5vw, 1.35rem);
		font-weight: 900;
		font-style: italic;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #1a0528;
		background: #ffba38;
		border: 3px solid rgba(255, 255, 255, 0.65);
		box-shadow:
			0 0.25em 0 rgba(120, 50, 0, 0.55),
			0 0 1.4em rgba(255, 196, 72, 0.34);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
	}

	article[data-outcome="win"] .versus-inner {
		background: #ff8b4d;
		box-shadow:
			0 0.25em 0 rgba(120, 40, 0, 0.5),
			0 0 1.6em rgba(255, 136, 77, 0.3);
	}

	article[data-outcome="loss"] .versus-inner {
		background: #8d63ff;
		color: rgba(255, 250, 255, 0.98);
		text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
	}

	article[data-outcome="draw"] .versus-inner {
		background: #7dd3fc;
		color: rgba(28, 12, 48, 0.95);
	}

	.confetti {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.piece {
		position: absolute;
		width: 0.65em;
		height: 1.2em;
		border-radius: 999px;
		opacity: 0.9;
	}

	.metric > p {
		margin: 0;
		font-size: 0.8em;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 220, 200, 0.72);
	}

	.contestant,
	.glyph {
		margin: 0;
	}
</style>
