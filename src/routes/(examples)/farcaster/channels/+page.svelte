<script lang="ts">
	// Props
	const {
		data,
	} = $props()

	let {
		channels,
	} = data
</script>



<article class="column">
	<header class="row">
		<h2>Popular Farcaster channels</h2>

		<p class="annotation row inline">
			<span>Source: </span><strong><a href="https://docs.farcaster.xyz/reference/farcaster/api">api.farcaster.xyz</a></strong>
		</p>
	</header>

	<div id="channels" class="row wrap">
		{#each channels.slice(0, 10) as channel}
			{@const channelUrl = new URL(channel.url)}

			<div class="card row">
				<div class="column">
					<p class="url row inline">
						<strong>{channel.name}</strong>
						<span>{channelUrl.hostname}</span>
					</p>

					<p class="annotation row inline wrap">
						<span><strong>{channel.followerCount.toLocaleString()}</strong> followers</span>
						<span>·</span>
						<span><strong>{channel.memberCount.toLocaleString()}</strong> members</span>
					</p>

					<p class="description">{channel.description}</p>
				</div>
			</div>
		{/each}
	</div>
</article>


<style>
	article {
		gap: 2em;
	}

	#channels {
		gap: 1em;
		align-items: stretch;
	}
	#channels > * {
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

	.description {
		font-size: 0.9em;
		line-height: 1.35;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.annotation {
		opacity: 0.9;
		font-size: 0.9em;
	}

	.annotation a {
		color: inherit;
	}

	.url.row.inline {
		gap: 0.35em;
		flex-wrap: wrap;
	}
</style>
