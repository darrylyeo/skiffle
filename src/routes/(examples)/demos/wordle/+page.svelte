<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Props
	let { data }: { data: PageData } = $props()
</script>


<section class="page" data-status={data.status}>
	<header>
		<h1>Wordle</h1>
		<strong>{data.message}</strong>
	</header>

	<section class="board" aria-label="Wordle board">
		{#each data.rows as row, rowIndex (`row:${rowIndex}`)}
			<div class="row">
				{#each row as cell (cell.id)}
					<div class="cell" data-state={cell.state}>{cell.letter}</div>
				{/each}
			</div>
		{/each}
	</section>
</section>


<style>
	.page {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		gap: 18px;
		padding: 22px;
		border: 1px solid rgba(255, 233, 222, 0.12);
		border-radius: 30px;
		overflow: hidden;
		background:
			radial-gradient(circle at 50% 14%, rgba(255, 218, 120, 0.16), transparent 22%),
			radial-gradient(circle at 18% 18%, rgba(56, 189, 115, 0.2), transparent 24%),
			radial-gradient(circle at 84% 18%, rgba(250, 204, 21, 0.18), transparent 26%),
			linear-gradient(180deg, rgba(28, 46, 46, 0.62), rgba(25, 34, 39, 0.42));
		color: #f8fafc;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1em 2.5em rgba(31, 11, 52, 0.18);
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	header > h1 {
		margin: 0;
		font-size: 42px;
		line-height: 1;
	}

	header > strong {
		align-self: flex-end;
		text-align: right;
		font-size: 18px;
		line-height: 1.3;
		color: rgba(255, 244, 239, 0.95);
	}

	.board {
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: flex-start;
		gap: 8px;
		padding: 10px;
		border-radius: 24px;
		background:
			radial-gradient(circle at 50% top, rgba(255, 255, 255, 0.08), transparent 30%),
			radial-gradient(circle at 18% 18%, rgba(34, 197, 94, 0.08), transparent 24%),
			radial-gradient(circle at 82% 20%, rgba(250, 204, 21, 0.08), transparent 24%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05)),
			rgba(32, 39, 44, 0.5);
		border: 1px solid rgba(255, 232, 223, 0.12);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 14px 30px rgba(48, 17, 82, 0.24);
	}

	.row {
		display: flex;
		flex-direction: row;
		flex: 1 1 0;
		min-height: 0;
		min-width: 0;
		align-items: stretch;
		gap: 8px;
	}

	.cell {
		display: flex;
		flex: 1 1 0;
		min-width: 0;
		min-height: 0;
		align-items: center;
		justify-content: center;
		border-radius: 14px;
		border: 1px solid rgba(255, 232, 223, 0.12);
		background: rgba(43, 16, 74, 0.34);
		font-size: 2rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.cell[data-state="empty"] {
		color: rgba(255, 228, 216, 0.2);
	}

	.cell[data-state="miss"] {
		background: rgba(239, 68, 68, 0.32);
		border-color: rgba(252, 165, 165, 0.44);
		color: #fee2e2;
	}

	.cell[data-state="present"] {
		background: rgba(250, 204, 21, 0.28);
		border-color: rgba(253, 224, 71, 0.42);
		color: #fef08a;
	}

	.cell[data-state="correct"] {
		background: rgba(34, 197, 94, 0.3);
		border-color: rgba(134, 239, 172, 0.46);
		color: #dcfce7;
	}

	.page[data-status="win"] .cell[data-state="correct"] {
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
