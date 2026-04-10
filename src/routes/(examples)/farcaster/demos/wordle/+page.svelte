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

	<section class="board" aria-label="Wordle board">
		{#each wordleRows(data) as row, rowIndex (`row:${rowIndex}`)}
			<div class="row">
				{#each row as cell (cell.id)}
					<span data-state={cell.state}>{cell.letter}</span>
				{/each}
			</div>
		{/each}
	</section>
</section>


<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 18px;
		min-height: 100%;
		padding: 22px;
		background:
			radial-gradient(circle at top left, rgba(255, 129, 72, 0.28), transparent 34%),
			radial-gradient(circle at top right, rgba(138, 99, 210, 0.34), transparent 44%),
			linear-gradient(160deg, #8a63d2 0%, #5b2e99 52%, #ff5b1f 100%);
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
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 226, 213, 0.88);
	}

	header > h1 {
		margin: 0;
		font-size: 42px;
		line-height: 1;
	}

	header > strong {
		font-size: 18px;
		line-height: 1.3;
		color: rgba(255, 244, 239, 0.95);
	}

	.board {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 10px;
		border-radius: 24px;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)),
			rgba(51, 20, 89, 0.34);
		border: 1px solid rgba(255, 232, 223, 0.12);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 14px 30px rgba(48, 17, 82, 0.24);
	}

	.row {
		display: flex;
		gap: 8px;
	}

	.row > span {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 44px;
		border-radius: 14px;
		border: 1px solid rgba(255, 232, 223, 0.12);
		background: rgba(43, 16, 74, 0.34);
		font-size: 22px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.row > span[data-state="empty"] {
		color: rgba(255, 228, 216, 0.2);
	}

	.row > span[data-state="miss"] {
		background: rgba(239, 68, 68, 0.32);
		border-color: rgba(252, 165, 165, 0.44);
		color: #fee2e2;
	}

	.row > span[data-state="present"] {
		background: rgba(250, 204, 21, 0.28);
		border-color: rgba(253, 224, 71, 0.42);
		color: #fef08a;
	}

	.row > span[data-state="correct"] {
		background: rgba(34, 197, 94, 0.3);
		border-color: rgba(134, 239, 172, 0.46);
		color: #dcfce7;
	}

	.page[data-status="win"] .row > span[data-state="correct"] {
		box-shadow:
			inset 0 0 0 1px rgba(240, 253, 244, 0.24),
			0 0 18px rgba(34, 197, 94, 0.2);
	}

	.page[data-status="loss"] .board {
		background:
			linear-gradient(180deg, rgba(109, 58, 175, 0.3), rgba(255, 255, 255, 0.05)),
			rgba(51, 20, 89, 0.34);
	}
</style>
