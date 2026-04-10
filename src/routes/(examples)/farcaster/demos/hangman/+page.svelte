<script lang="ts">
	// Types/constants
	import { hangmanLetters, hangmanLives, hangmanMessage, hangmanMisses, hangmanUsedLetters } from './hangman-frame'

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
			<span data-revealed={letter.revealed}>
				{letter.revealed ? letter.label : '_'}
			</span>
		{/each}
	</div>

	<div class="meta">
		<div class="panel">
			<p>Used</p>
			<div class="used" aria-label="Used guesses">
				{#if hangmanUsedLetters(data).length}
					{#each hangmanUsedLetters(data) as letter (letter.id)}
						<span data-hit={letter.hit}>{letter.label}</span>
					{/each}
				{:else}
					<em>None yet</em>
				{/if}
			</div>
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
	</div>
</section>


<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 12px;
		min-height: 100%;
		padding: 18px 24px;
		border: 1px solid rgba(255, 233, 222, 0.12);
		border-radius: 30px;
		overflow: hidden;
		background:
			radial-gradient(circle at 14% 12%, rgba(255, 154, 88, 0.26), transparent 22%),
			radial-gradient(circle at 86% 18%, rgba(92, 55, 165, 0.3), transparent 28%),
			radial-gradient(circle at 50% 100%, rgba(255, 112, 72, 0.12), transparent 36%),
			linear-gradient(180deg, rgba(64, 28, 40, 0.62), rgba(40, 18, 30, 0.44));
		color: #f9fafb;
		font-family: Inter, ui-sans-serif, system-ui, sans-serif;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 1em 2.4em rgba(33, 12, 55, 0.2);
	}

	header {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	header > p {
		margin: 0;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(255, 224, 211, 0.9);
	}

	header > h1 {
		margin: 0;
		font-size: 38px;
		line-height: 1;
	}

	header > strong {
		font-size: 16px;
		line-height: 1.3;
		color: rgba(255, 245, 240, 0.96);
	}

	.lives {
		display: flex;
		gap: 8px;
	}

	.lives > span {
		flex: 1;
		height: 10px;
		border-radius: 999px;
		background: rgba(39, 17, 71, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.14);
	}

	.lives > span[data-alive="true"] {
		background: linear-gradient(90deg, #ffb36b 0%, #ff6e2f 100%);
		border-color: rgba(255, 193, 130, 0.56);
	}

	.word {
		display: flex;
		gap: 8px;
		justify-content: space-between;
	}

	.word > span {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		flex: 1;
		height: 48px;
		border-radius: 12px;
		border: 1px solid rgba(255, 209, 191, 0.18);
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.05)),
			rgba(55, 23, 95, 0.28);
		font-size: 24px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.12),
			0 10px 24px rgba(39, 17, 71, 0.22);
	}

	.word > span[data-revealed="false"] {
		color: rgba(255, 231, 218, 0.84);
	}

	.meta {
		display: flex;
		gap: 8px;
	}

	.meta > * {
		max-width: 100%;
	}

	.panel {
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 8px;
		padding: 10px 12px;
		border-radius: 18px;
		background:
			radial-gradient(circle at left top, rgba(255, 198, 152, 0.16), transparent 26%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.04)),
			rgba(63, 24, 41, 0.32);
		border: 1px solid rgba(255, 224, 211, 0.14);
	}

	.panel > p {
		margin: 0;
		font-size: 14px;
		font-weight: 700;
		color: rgba(255, 218, 198, 0.88);
	}

	.misses {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		min-height: 24px;
	}

	.used {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		min-height: 24px;
	}

	.used > span,
	.used > em,
	.misses > span,
	.misses > em {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 38px;
		height: 24px;
		padding: 0 8px;
		border-radius: 999px;
		font-size: 14px;
		font-style: normal;
	}

	.used > span[data-hit="true"] {
		background: rgba(138, 99, 210, 0.22);
		color: #f0e7ff;
		border: 1px solid rgba(203, 172, 255, 0.3);
	}

	.used > span[data-hit="false"] {
		background: rgba(255, 109, 53, 0.2);
		color: #ffd9cb;
		border: 1px solid rgba(255, 176, 143, 0.3);
	}

	.used > em,
	.misses > span {
		background: rgba(255, 109, 53, 0.2);
		color: #ffd9cb;
		border: 1px solid rgba(255, 176, 143, 0.3);
	}

	.misses > em {
		color: rgba(255, 233, 224, 0.7);
		background: rgba(255, 255, 255, 0.08);
	}

	.used > em {
		color: rgba(255, 233, 224, 0.7);
		background: rgba(255, 255, 255, 0.08);
	}

	.misses > span {
		background: rgba(255, 109, 53, 0.2);
		color: #ffd9cb;
		border: 1px solid rgba(255, 176, 143, 0.3);
	}

	.page[data-status="win"] .panel {
		background:
			linear-gradient(180deg, rgba(255, 194, 120, 0.2), rgba(255, 255, 255, 0.04)),
			rgba(46, 19, 80, 0.32);
		border-color: rgba(255, 204, 148, 0.34);
	}

	.page[data-status="loss"] .panel {
		background:
			linear-gradient(180deg, rgba(255, 109, 53, 0.18), rgba(255, 255, 255, 0.04)),
			rgba(46, 19, 80, 0.32);
		border-color: rgba(255, 176, 143, 0.24);
	}
</style>
