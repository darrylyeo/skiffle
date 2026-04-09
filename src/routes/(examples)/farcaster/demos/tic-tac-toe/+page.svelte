<script lang='ts'>
	// Props
	let {
		data,
	}: {
		data: {
			rows: string[][],
			message: string,
			status: 'turn' | 'invalid' | 'x-win' | 'o-win' | 'draw',
		},
	} = $props()
</script>


<article class='column'>
	<header>
		<h2>Tic-tac-toe</h2>
		<p class='annotation'>{data.message}</p>
	</header>

	<div class='board column' data-status={data.status}>
		{#each data.rows as row}
			<p class='row'>
				{#each row as cell}
					<span>{cell}</span>
				{/each}
			</p>
		{/each}
	</div>
</article>


<style>
	article {
		height: 100%;
		justify-content: center;
		align-items: center;
		text-align: center;
		gap: 1em;
	}

	header {
		gap: 0.35em;
	}

	h2 {
		font-size: 1.3em;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.95);
	}

	.annotation {
		font-size: 0.9em;
		color: rgba(255, 255, 255, 0.72);
	}

	.board {
		gap: 0.25em;
		padding: 0.7em;
		border-radius: 0.75em;
		background-color: rgba(0, 0, 0, 0.22);
	}

	.board > p {
		gap: 0.25em;
	}

	.board span {
		width: 1.9em;
		height: 1.9em;
		display: grid;
		place-items: center;
		border-radius: 0.35em;
		font-size: 1.55em;
		font-weight: 700;
		background-color: rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.95);
	}

	.board[data-status='x-win'] span,
	.board[data-status='draw'] span {
		background-color: rgba(56, 189, 248, 0.22);
	}

	.board[data-status='o-win'] span {
		background-color: rgba(248, 113, 113, 0.22);
	}
</style>
