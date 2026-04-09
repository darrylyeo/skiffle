<script lang='ts'>
	// Props
	let {
		data,
	}: {
		data: {
			rounds: number,
			wins: number,
			losses: number,
			summary: string,
		},
	} = $props()
</script>


<article class='column'>
	<header>
		<h2>Coin flip</h2>
		<p class='annotation'>{data.summary}</p>
	</header>

	<section class='stats row'>
		<p class='metric column'>
			<span>Rounds</span>
			<strong>{data.rounds}</strong>
		</p>
		<p class='metric column'>
			<span>Wins</span>
			<strong>{data.wins}</strong>
		</p>
		<p class='metric column'>
			<span>Losses</span>
			<strong>{data.losses}</strong>
		</p>
	</section>
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

	.stats {
		gap: 0.6em;
	}

	.metric {
		min-width: 6em;
		padding: 0.65em 0.75em;
		gap: 0.25em;
		border-radius: 0.6em;
		background-color: rgba(0, 0, 0, 0.22);
	}

	.metric > span {
		font-size: 0.78em;
		color: rgba(255, 255, 255, 0.68);
	}

	.metric > strong {
		font-size: 1.6em;
		line-height: 1;
		color: rgba(255, 255, 255, 0.96);
	}
</style>
