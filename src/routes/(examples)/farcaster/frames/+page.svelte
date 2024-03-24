<script lang="ts">
	// Props
	const {
		data,
	} = $props()

	let {
		topFrames,
	} = data
</script>


<article class="column">
	<header class="row">
		<h2>Top Frames on Farcaster</h2>

		<p class="annotation row inline">
			<span>Source: </span><strong>OpenRank by Karma3Labs</strong>
		</p>
	</header>

	<div id="frames" class="row wrap">
		{#each topFrames.slice(0, 10) as frameInfo}
			{@const url = new URL(frameInfo.url)}

			{@const topCasterUsernames = (
				Object.entries(
					Object.groupBy(
						frameInfo.warpcast_urls
							.map(url => (
								url.match(/https:\/\/warpcast.com\/([^/]+)\//)[1]
							)),
						username => username
					)
				)
					.sort((a, b) => b[1].length - a[1].length)
					.map(([username]) => username)
			)}

			{@const castCount = frameInfo.warpcast_urls.length}

			<div class="card row">
				<div class="column">
					<p class="url row inline"><strong>{url.host}</strong><span>{url.pathname.replace(/\/$/, '')}</span></p>

					<p class="annotation row inline wrap">
						<span>casted</span>
						<span><strong>{castCount} time{castCount === 1 ? '' : 's'}</strong></span>
						<span>by</span>
						<span>{
							new Intl.ListFormat('en-US', {
								style: 'long',
								type: 'conjunction',
							})
								.format(
									topCasterUsernames.length > 2
										? [
											...topCasterUsernames.slice(0, 2),
											`${topCasterUsernames.length - 2} others`,
										]
										: topCasterUsernames,
								)
						}</span>
					</p>
				</div>
			</div>
		{/each}
	</div>
</article>


<style>
	article {
		gap: 2em;
	}

	#frames {
		gap: 1em;
		align-items: stretch;
	}
	#frames > * {
		flex: 1 0 40%;
	}

	.card {
		padding: 1.25em;
		border-radius: 1em;
		background-color: rgba(255, 255, 255, 0.05);
		overflow: hidden;
	}

	p {
		color: rgba(255, 255, 255, 0.75);
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
	}
	p strong {
		color: rgba(255, 255, 255, 0.9);
		overflow: hidden;
	}

	.annotation {
		opacity: 0.9;
		font-size: 0.9em;
	}

	.url.row.inline {
		gap: 0;
		white-space: nowrap;
	}
</style>
