<script lang="ts">
	// Types/constants
	import { wordleMessage, wordleRows } from './wordle-frame'

	type Props = {
		data: {
			word: number
			guesses: string[]
			status: 'turn' | 'invalid' | 'repeat' | 'win' | 'loss'
		}
	}

	// Props
	let { data }: Props = $props()
</script>


<section class="page" data-status={data.status}>
	<header>
		<p>Word Game</p>
		<h1>Wordle</h1>
		<strong>{wordleMessage(data)}</strong>
	</header>

	<div class="board" aria-label="Wordle board">
		{#each wordleRows(data) as row, rowIndex (`row:${rowIndex}`)}
			<div class="row">
				{#each row as cell (cell.id)}
					<span data-state={cell.state}>{cell.letter}</span>
				{/each}
			</div>
		{/each}
	</div>
</section>


<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 24px;
		min-height: 100%;
		padding: 32px;
		background:
			radial-gradient(circle at top right, rgba(45, 212, 191, 0.18), transparent 36%),
			linear-gradient(180deg, #121826 0%, #0a0f18 100%);
		color: #f8fafc;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	header > p {
		margin: 0;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: #5eead4;
	}

	header > h1 {
		margin: 0;
		font-size: 52px;
		line-height: 1;
	}

	header > strong {
		font-size: 24px;
		line-height: 1.3;
	}

	.board {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.row {
		display: flex;
		gap: 10px;
	}

	.row > span {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 54px;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		font-size: 26px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.row > span[data-state="empty"] {
		color: rgba(255, 255, 255, 0.16);
	}

	.row > span[data-state="miss"] {
		background: rgba(71, 85, 105, 0.4);
		border-color: rgba(148, 163, 184, 0.18);
	}

	.row > span[data-state="present"] {
		background: rgba(250, 204, 21, 0.24);
		border-color: rgba(250, 204, 21, 0.38);
		color: #fef08a;
	}

	.row > span[data-state="correct"] {
		background: rgba(34, 197, 94, 0.22);
		border-color: rgba(134, 239, 172, 0.42);
		color: #bbf7d0;
	}

	.page[data-status="win"] .row > span[data-state="correct"] {
		box-shadow: inset 0 0 0 1px rgba(187, 247, 208, 0.26);
	}

	.page[data-status="loss"] .board {
		opacity: 0.92;
	}
</style>
