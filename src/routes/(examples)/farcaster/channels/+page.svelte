<script lang="ts">
	// Functions
	import { isValidHttpUrl } from '../api/farcaster-client'

	const channelHostname = (href: string) => {
		try {
			return new URL(href).hostname
		} catch {
			return ''
		}
	}



	// Props
	const {
		data,
	} = $props()

	let {
		displayChannels,
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
		{#each displayChannels as channel (channel.id)}
			{@const headerOk = (
				Boolean(channel.headerImageUrl)
				&& isValidHttpUrl(channel.headerImageUrl)
			)}
			{@const imageOk = (
				Boolean(channel.imageUrl)
				&& isValidHttpUrl(channel.imageUrl)
			)}
			{@const bannerUrl = (
				headerOk
					? channel.headerImageUrl
				: imageOk
					? channel.imageUrl
				:
					''
			)}
			{@const showAvatar = headerOk && imageOk}
			{@const hostname = channelHostname(channel.url)}

			<section class="card column">
				{#if bannerUrl}
					<div class="media">
						<img
							class="banner"
							src={bannerUrl}
							alt=""
						/>
						{#if showAvatar}
							<img
								class="image"
								src={channel.imageUrl}
								alt={channel.name}
							/>
						{/if}
					</div>
				{/if}

				<div
					class="body column"
					class:pad-for-avatar={showAvatar}
				>
					<p class="url row inline">
						<strong>{channel.name}</strong>
						<span>{hostname}</span>
					</p>

					<p class="annotation row inline wrap">
						<span><strong>{channel.followerCount.toLocaleString()}</strong> followers</span>
						<span>·</span>
						<span><strong>{channel.memberCount.toLocaleString()}</strong> members</span>
					</p>

					<p class="description">{channel.description}</p>
				</div>
			</section>
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
		overflow: hidden;
		border-radius: 1em;
		background-color: rgba(255, 255, 255, 0.05);
	}

	.card > .media {
		position: relative;
	}

	.card > .media > .banner {
		display: block;
		width: 100%;
		aspect-ratio: 2 / 1;
		object-fit: cover;
	}

	.card > .media > .image {
		position: absolute;
		left: 1rem;
		bottom: -2.25rem;
		width: 4.5rem;
		height: 4.5rem;
		border-radius: 0.75rem;
		object-fit: cover;
		box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.45);
	}

	.card > .body {
		padding: 1.25em;
		gap: 0.65em;
	}

	.card > .body.pad-for-avatar {
		padding-top: 2.85rem;
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
