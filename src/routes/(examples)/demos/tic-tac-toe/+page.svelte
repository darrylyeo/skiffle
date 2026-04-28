<script lang='ts'>
	// Types/constants
	const CONFETTI = [
		{ x: '10%', y: '16%', r: '-16deg', color: '#fde047' },
		{ x: '18%', y: '9%', r: '12deg', color: '#facc15' },
		{ x: '28%', y: '18%', r: '18deg', color: '#38bdf8' },
		{ x: '72%', y: '14%', r: '-12deg', color: '#fbbf24' },
		{ x: '80%', y: '8%', r: '14deg', color: '#60a5fa' },
		{ x: '87%', y: '18%', r: '-20deg', color: '#fef08a' },
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
		<h2>Tic-tac-toe</h2>
		{#if data.message}
			<p class='annotation'>{data.message}</p>
		{/if}
	</header>

	<section class='board column' data-status={data.status}>
		{#each data.rows as row, rowIndex (`row:${rowIndex}`)}
			<div class='board-row'>
				{#each row as cell (cell.id)}
					<div
						class='cell'
						data-occupied={cell.occupied}
						data-highlighted={cell.highlighted}
						data-player={cell.label === 'X' || cell.label === 'O' ? cell.label : undefined}
					>
						{cell.label}
					</div>
				{/each}
			</div>
		{/each}
	</section>

	<footer class='legend row'>
		<div class='chip chip-you column'>
			<span>You</span>
			<strong>X</strong>
		</div>
		<div class='chip chip-cpu column'>
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
		border: 1px solid rgba(96, 165, 250, 0.35);
		border-radius: 28px;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1rem;
		padding: 0.5rem 0.55rem 0.75rem;
		overflow: hidden;
		background:
			radial-gradient(circle at 14% 18%, rgba(59, 130, 246, 0.55), transparent 30%),
			radial-gradient(circle at 86% 16%, rgba(250, 204, 21, 0.42), transparent 28%),
			radial-gradient(circle at 50% 92%, rgba(253, 224, 71, 0.16), transparent 38%),
			linear-gradient(165deg, rgba(23, 37, 84, 0.94), rgba(55, 48, 14, 0.88));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			0 1em 2.8em rgba(15, 5, 40, 0.45);
	}

	header {
		gap: 0.4375rem;
	}

	h2 {
		font-size: 3rem;
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: #fffbeb;
		/* Single shadow — multi-layer text-shadow can crash Resvg on ?image= */
		text-shadow: 0 0.1em 0.32em rgba(15, 23, 42, 0.55);
	}

	.annotation {
		max-width: 20rem;
		font-size: 1.0625rem;
		line-height: 1.35;
		font-weight: 600;
		color: rgba(224, 231, 255, 0.92);
	}

	.board {
		gap: 0.75rem;
		padding: 1.5rem;
		border-radius: 24px;
		background:
			radial-gradient(circle at 18% 0%, rgba(59, 130, 246, 0.28), transparent 34%),
			radial-gradient(circle at 82% 100%, rgba(250, 204, 21, 0.22), transparent 32%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04)),
			rgba(30, 41, 79, 0.72);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			0 0.9em 2.2em rgba(15, 23, 42, 0.45);
		border: 1px solid rgba(147, 197, 253, 0.28);
	}

	.board-row {
		display: flex;
		gap: 0.75rem;
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
		width: 6.5rem;
		height: 6.5rem;
		padding: 0;
		border-radius: 1rem;
		border: 1px solid rgba(148, 163, 184, 0.45);
		font-weight: 700;
		background-color: rgba(51, 65, 85, 0.72);
		color: rgba(226, 232, 240, 0.92);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.cell[data-occupied="false"] {
		align-items: flex-start;
		justify-content: flex-start;
		padding: 0.45rem 0.5rem;
		font-size: 1.375rem;
		color: rgba(148, 163, 184, 0.88);
	}

	.cell[data-occupied="true"] {
		font-size: 3.625rem;
		line-height: 1;
		letter-spacing: -0.06em;
	}

	.cell[data-player="X"] {
		background-color: rgba(23, 37, 84, 0.92);
		color: #bfdbfe;
		border-color: rgba(96, 165, 250, 0.65);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 0 0.85rem rgba(59, 130, 246, 0.25);
	}

	.cell[data-player="O"] {
		background-color: rgba(66, 32, 6, 0.9);
		color: #fef9c3;
		border-color: rgba(250, 204, 21, 0.72);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 0 0.85rem rgba(250, 204, 21, 0.32);
	}

	.cell[data-highlighted="true"] {
		background-color: rgba(30, 58, 138, 0.88);
		color: #fefce8;
		border-color: rgba(253, 224, 71, 0.85);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.18),
			0 0 1rem rgba(250, 204, 21, 0.4);
	}

	.cell[data-highlighted="true"][data-player="O"] {
		background-color: rgba(113, 63, 18, 0.92);
		color: #fffbeb;
		border-color: rgba(254, 240, 138, 0.9);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			0 0 1rem rgba(253, 224, 71, 0.45);
	}

	.board[data-status="draw"] .cell {
		background-color: rgba(51, 65, 85, 0.55);
		color: rgba(203, 213, 225, 0.9);
	}

	article[data-status="o-win"] .board {
		background:
			linear-gradient(180deg, rgba(250, 204, 21, 0.2), rgba(255, 255, 255, 0.05)),
			rgba(55, 48, 14, 0.58);
		border-color: rgba(253, 224, 71, 0.38);
	}

	.legend {
		gap: 0.75rem;
		justify-content: center;
	}

	.chip {
		min-width: 6.375rem;
		padding: 0.6875rem 0.9375rem;
		border-radius: 0.875rem;
		border-width: 2px;
		border-style: solid;
	}

	.chip-you {
		background-color: rgba(30, 58, 138, 0.45);
		border-color: rgba(96, 165, 250, 0.75);
		box-shadow: 0 0 1.1rem rgba(59, 130, 246, 0.28);
	}

	.chip-cpu {
		background-color: rgba(66, 32, 6, 0.5);
		border-color: rgba(250, 204, 21, 0.82);
		box-shadow: 0 0 1.1rem rgba(250, 204, 21, 0.3);
	}

	.chip > span {
		font-size: 0.8125rem;
		font-weight: 600;
		color: rgba(254, 249, 195, 0.88);
	}

	.chip-you > strong {
		font-size: 1.75rem;
		color: #dbeafe;
	}

	.chip-cpu > strong {
		font-size: 1.75rem;
		color: #fef9c3;
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
