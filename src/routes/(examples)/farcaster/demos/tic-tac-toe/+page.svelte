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
				occupied: boolean,
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
					<div class='cell' data-occupied={cell.occupied} data-highlighted={cell.highlighted}>
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
		width: 100%;
		height: 100%;
		border: 1px solid rgba(255, 232, 223, 0.12);
		border-radius: 28px;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 16px;
		padding: 8px 9px 12px;
		overflow: hidden;
		background:
			radial-gradient(circle at 18% 16%, rgba(255, 148, 104, 0.22), transparent 22%),
			radial-gradient(circle at 82% 14%, rgba(179, 142, 255, 0.24), transparent 24%),
			radial-gradient(circle at 50% 88%, rgba(255, 190, 150, 0.08), transparent 34%),
			linear-gradient(180deg, rgba(45, 31, 86, 0.62), rgba(29, 21, 58, 0.42));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1em 2.4em rgba(31, 11, 52, 0.18);
	}

	header {
		gap: 5px;
	}

	.eyebrow {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: rgba(255, 227, 214, 0.8);
	}

	h2 {
		font-size: 30px;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.annotation {
		max-width: 320px;
		font-size: 16px;
		line-height: 1.35;
		color: rgba(255, 241, 234, 0.78);
	}

	.board {
		gap: 10px;
		padding: 18px;
		border-radius: 22px;
		background:
			radial-gradient(circle at 50% top, rgba(255, 255, 255, 0.08), transparent 26%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05)),
			rgba(56, 21, 98, 0.38);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 0.9em 2em rgba(49, 17, 84, 0.22);
		border: 1px solid rgba(255, 232, 223, 0.12);
	}

	.board-row {
		display: flex;
		gap: 10px;
	}

	.board-row > * {
		max-width: 100%;
	}

	.cell {
		position: relative;
		display: flex;
		box-sizing: border-box;
		align-items: center;
		justify-content: center;
		width: 66px;
		height: 66px;
		padding: 0;
		border-radius: 13px;
		border: 1px solid rgba(255, 232, 223, 0.12);
		font-weight: 700;
		background-color: rgba(62, 26, 106, 0.42);
		color: rgba(255, 255, 255, 0.96);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.cell[data-occupied="false"] {
		align-items: flex-start;
		justify-content: flex-start;
		padding: 5px 6px;
		font-size: 18px;
		color: rgba(255, 233, 223, 0.56);
	}

	.cell[data-occupied="true"] {
		font-size: 47px;
		line-height: 1;
		letter-spacing: -2px;
	}

	.cell[data-highlighted="true"] {
		background:
			linear-gradient(180deg, rgba(255, 171, 112, 0.3), rgba(255, 255, 255, 0.04)),
			rgba(255, 98, 38, 0.3);
		border-color: rgba(255, 196, 153, 0.48);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.15),
			0 0 13px rgba(255, 128, 73, 0.2);
	}

	.board[data-status="draw"] .cell {
		background-color: rgba(93, 49, 152, 0.42);
	}

	article[data-status="o-win"] .board {
		background:
			linear-gradient(180deg, rgba(119, 70, 186, 0.26), rgba(255, 255, 255, 0.05)),
			rgba(56, 21, 98, 0.34);
	}

	.legend {
		gap: 12px;
		justify-content: center;
	}

	.chip {
		min-width: 102px;
		padding: 11px 15px;
		border-radius: 11px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04)),
			rgba(56, 21, 98, 0.28);
		border: 1px solid rgba(255, 232, 223, 0.1);
	}

	.chip > span {
		font-size: 13px;
		color: rgba(255, 233, 223, 0.72);
	}

	.chip > strong {
		font-size: 26px;
		color: rgba(255, 255, 255, 0.96);
	}

	.confetti {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.piece {
		position: absolute;
		width: 10px;
		height: 18px;
		border-radius: 999px;
		opacity: 0.85;
	}
</style>
