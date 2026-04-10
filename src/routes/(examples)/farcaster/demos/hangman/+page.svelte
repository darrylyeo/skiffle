<script lang="ts">
	// Types/constants
	import { hangmanLetters, hangmanLives, hangmanMessage, hangmanMisses } from './hangman-frame'

	type Props = {
		data: {
			word: number
			guesses: string
			status: 'turn' | 'invalid' | 'repeat' | 'win' | 'loss'
		}
	}

	// Props
	let { data }: Props = $props()
</script>


<section class="page" data-status={data.status}>
	<header>
		<p>Word Game</p>
		<h1>Hangman</h1>
		<strong>{hangmanMessage(data)}</strong>
	</header>

	<div class="lives" aria-label="Lives">
		{#each hangmanLives(data) as alive, index (`life:${index}`)}
			<span data-alive={alive}></span>
		{/each}
	</div>

	<div class="word" aria-label="Hidden word">
		{#each hangmanLetters(data) as letter (letter.id)}
			<span data-revealed={letter.revealed}>{letter.label}</span>
		{/each}
	</div>

	<div class="panel">
		<p>Misses</p>
		<div class="misses" aria-label="Missed guesses">
			{#if hangmanMisses(data).length}
				{#each hangmanMisses(data) as miss (`miss:${miss}`)}
					<span>{miss}</span>
				{/each}
			{:else}
				<em>None yet</em>
			{/if}
		</div>
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
			radial-gradient(circle at top left, rgba(196, 181, 253, 0.28), transparent 36%),
			linear-gradient(180deg, #1f1636 0%, #120d22 100%);
		color: #f9fafb;
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
		color: #c4b5fd;
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

	.lives {
		display: flex;
		gap: 12px;
	}

	.lives > span {
		flex: 1;
		height: 14px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.12);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.lives > span[data-alive="true"] {
		background: linear-gradient(90deg, #22c55e 0%, #86efac 100%);
		border-color: rgba(134, 239, 172, 0.5);
	}

	.word {
		display: flex;
		gap: 12px;
	}

	.word > span {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		height: 68px;
		border-radius: 18px;
		border: 1px solid rgba(196, 181, 253, 0.26);
		background: rgba(255, 255, 255, 0.06);
		font-size: 34px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.word > span[data-revealed="false"] {
		color: transparent;
		position: relative;
	}

	.word > span[data-revealed="false"]::after {
		content: '';
		position: absolute;
		left: 12px;
		right: 12px;
		bottom: 16px;
		height: 5px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.78);
	}

	.panel {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 20px 22px;
		border-radius: 22px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.panel > p {
		margin: 0;
		font-size: 17px;
		font-weight: 700;
		color: #d8b4fe;
	}

	.misses {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		min-height: 34px;
	}

	.misses > span,
	.misses > em {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 52px;
		height: 34px;
		padding: 0 12px;
		border-radius: 999px;
		font-size: 18px;
		font-style: normal;
	}

	.misses > span {
		background: rgba(248, 113, 113, 0.16);
		color: #fca5a5;
		border: 1px solid rgba(248, 113, 113, 0.28);
	}

	.misses > em {
		color: rgba(255, 255, 255, 0.68);
		background: rgba(255, 255, 255, 0.04);
	}

	.page[data-status="win"] .panel {
		background: rgba(34, 197, 94, 0.12);
		border-color: rgba(134, 239, 172, 0.34);
	}

	.page[data-status="loss"] .panel {
		background: rgba(248, 113, 113, 0.1);
		border-color: rgba(248, 113, 113, 0.24);
	}
</style>
