<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	import { CHANNELS_PAGE_SIZE } from './channels-frame'

	const channelHostname = (href: string) => {
		try {
			return new URL(href).hostname
		} catch {
			return ''
		}
	}

	const channelDescription = (description: string) => (
		description
			.replaceAll(/\s+/g, ' ')
			.trim()
			.slice(0, 110)
	)

	const channelInitials = (name: string) => (
		name
			.split(/[^A-Za-z0-9]+/)
			.filter((part) => part.length > 0)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
			|| name.slice(0, 2).toUpperCase()
			|| 'FC'
	)

	const channelDetailHref = (channelId: string) => (
		`/farcaster/channels/channel/${encodeURIComponent(channelId)}`
	)

	const channelImageSrc = (url: string) => (
		url.trim() ? url.trim() : ''
	)

	// Props
	let { data }: { data: PageData } = $props()
</script>



<article class="column">
	<header class="row">
		<h2>Popular Farcaster channels</h2>

		<p class="annotation row inline">
			<span>Source: </span><strong><a href="https://docs.farcaster.xyz/reference/farcaster/api">api.farcaster.xyz</a></strong>
		</p>
	</header>

	<div id="channels" class="row wrap">
		{#each data.displayChannels as channel (channel.id)}
			{@const hostname = channelHostname(channel.url)}
			{@const description = channelDescription(channel.description)}
			{@const artSrc = channelImageSrc(channel.imageUrl) || channelImageSrc(channel.headerImageUrl)}

			<a class="card" href={channelDetailHref(channel.id)}>
				<div class="card-art">
					{#if artSrc}
						<img
							class="card-art-img"
							src={artSrc}
							alt=""
							width="120"
							height="120"
						/>
					{:else}
						<div class="badge">{channelInitials(channel.name)}</div>
					{/if}
				</div>

				<div class="card-main">
					<div class="body column">
						<p class="url row inline">
							<strong>{channel.name}</strong>
							<span>{hostname}</span>
						</p>

						<p class="annotation row inline wrap">
							<span><strong>{channel.followerCount.toLocaleString()}</strong> followers</span>
							<span>·</span>
							<span><strong>{channel.memberCount.toLocaleString()}</strong> members</span>
							{#if channel.castingMode}
								<span>·</span>
								<span>{channel.castingMode}</span>
							{/if}
						</p>

						<p class="description">
							{description}{description.length < channel.description.trim().length ? '...' : ''}
						</p>
					</div>
				</div>
			</a>
		{/each}
	</div>

	{#if data.hasMoreChannels}
		<p class="more row">
			<a href={`?page=${data.currentPage}&count=${data.visibleCount + CHANNELS_PAGE_SIZE}`}>Load more channels</a>
		</p>
	{/if}
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
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: flex-start;
		overflow: hidden;
		min-height: 7.5rem;
		border-radius: 1em;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03)),
			rgba(35, 17, 61, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: inherit;
		text-decoration: none;
	}

	.card-art {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: flex-start;
		flex: 0 0 7.5rem;
		width: 7.5rem;
		align-self: stretch;
		min-height: 7.5rem;
	}

	.card-art-img {
		display: block;
		width: 7.5rem;
		height: 7.5rem;
		object-fit: cover;
		object-position: center;
		border-radius: 1em 0 0 1em;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
	}

	.card-art .badge {
		border-radius: 1em 0 0 1em;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
	}

	.card > .card-main {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		flex: 1;
		min-width: 0;
		padding: 1em 1.1em 1em 1em;
		gap: 0;
	}

	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 7.5rem;
		height: 7.5rem;
		background:
			linear-gradient(135deg, rgba(255, 173, 113, 0.34), rgba(138, 99, 210, 0.2)),
			rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.96);
		font-family: 'Fira Code', monospace;
		font-size: 1.35rem;
		font-weight: 700;
	}

	.card > .card-main > .body {
		gap: 0.65em;
		flex: 0 1 auto;
		min-width: 0;
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
	}

	.annotation {
		opacity: 0.9;
		font-size: 0.9em;
	}

	.annotation a {
		color: inherit;
	}

	.more {
		justify-content: center;
	}

	.more a {
		padding: 0.75em 1.1em;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.9);
		text-decoration: none;
	}

	.url.row.inline {
		gap: 0.35em;
		flex-wrap: wrap;
	}
</style>
