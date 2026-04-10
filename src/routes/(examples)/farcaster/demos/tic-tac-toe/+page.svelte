<script lang='ts'>
	// Types/constants
	const CONFETTI = [
		{ x: '10%', y: '16%', r: '-16deg', color: '#fde047' },
		{ x: '18%', y: '9%', r: '12deg', color: '#fb7185' },
		{ x: '28%', y: '18%', r: '18deg', color: '#38bdf8' },
		{ x: '72%', y: '14%', r: '-12deg', color: '#facc15' },
		{ x: '80%', y: '8%', r: '14deg', color: '#34d399' },
		{ x: '87%', y: '18%', r: '-20deg', color: '#f472b6' },
	] as const

	type Props = {
		data: {
			rows: {
				id: string,
				label: string,
				highlighted: boolean,
			}[][],
			message: string,
			status: 'turn' | 'invalid' | 'x-win' | 'o-win' | 'draw',
		},
	}


	// Props
	let { data }: Props = $props()
</script>


<article class='column' data-status={data.status}>
	{#if data.status === 'x-win'}
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
				data.status === 'x-win' ? 'Victory'
				: data.status === 'o-win' ? 'Defeat'
				: data.status === 'draw' ? 'Stalemate'
				: data.status === 'invalid' ? 'Try again'
				:
					'Your move'
			}
		</p>
		<h2>Tic-tac-toe</h2>
		<p class='annotation'>{data.message}</p>
	</header>

	<section class='board column' data-status={data.status}>
		{#each data.rows as row, rowIndex (`row:${rowIndex}`)}
			<div class='board-row'>
				{#each row as cell (cell.id)}
					<div class='cell' data-highlighted={cell.highlighted}>
						{cell.label}
					</div>
				{/each}
			</div>
		{/each}
	</section>

	<footer class='legend row'>
		<div class='chip column'>
			<span>You</span>
			<strong>X</strong>
		</div>
		<div class='chip column'>
			<span>CPU</span>
			<strong>O</strong>
		</div>
	</footer>
</article>


<style>
	article {
		position: relative;
		height: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1.15em;
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
		max-width: 24em;
		font-size: 0.92em;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.72);
	}

	.board {
		gap: 0.35em;
		padding: 0.9em;
		border-radius: 1em;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03)),
			rgba(0, 0, 0, 0.18);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 0.5em 1.5em rgba(0, 0, 0, 0.16);
	}

	.board-row {
		display: flex;
		gap: 0.35em;
	}

	.board-row > * {
		max-width: 100%;
	}

	.cell {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.45em;
		height: 2.45em;
		border-radius: 0.5em;
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 1.65em;
		font-weight: 700;
		background-color: rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.95);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.cell[data-highlighted='true'] {
		background-color: rgba(56, 189, 248, 0.28);
		border-color: rgba(125, 211, 252, 0.45);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.15),
			0 0 0.8em rgba(56, 189, 248, 0.2);
	}

	.board[data-status='draw'] .cell {
		background-color: rgba(255, 255, 255, 0.16);
	}

	article[data-status='o-win'] .board {
		background:
			linear-gradient(180deg, rgba(248, 113, 113, 0.12), rgba(255, 255, 255, 0.03)),
			rgba(0, 0, 0, 0.18);
	}

	.legend {
		gap: 0.75em;
		justify-content: center;
	}

	.chip {
		min-width: 5.5em;
		padding: 0.55em 0.75em;
		border-radius: 0.7em;
		background-color: rgba(0, 0, 0, 0.18);
	}

	.chip > span {
		font-size: 0.76em;
		color: rgba(255, 255, 255, 0.65);
	}

	.chip > strong {
		font-size: 1.3em;
		color: rgba(255, 255, 255, 0.96);
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
