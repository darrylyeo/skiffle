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

	const channelImageSrc = (url: string | null | undefined) => (
		typeof url === 'string' && url.trim()
			? url.trim()
			: ''
	)

	// Props
	let { data }: { data: PageData } = $props()

	const channelRows = $derived(
		Array.from(
			{ length: Math.ceil(data.displayChannels.length / 2) },
			(_, rowIndex) => data.displayChannels.slice(rowIndex * 2, rowIndex * 2 + 2),
		)
	)
</script>



<article class="column channels-page">
	<header class="row">
		<h2>Popular Farcaster channels</h2>

		<p class="annotation row inline">
			<span>Source: </span><strong><a href="https://docs.farcaster.xyz/reference/farcaster/api">api.farcaster.xyz</a></strong>
		</p>
	</header>

	<div class="channels-grid column">
		{#each channelRows as row, rowIndex (`channels-row:${rowIndex}:${row[0]?.id ?? ''}`)}
			<div class="channels-row row">
				{#each row as channel (channel.id)}
					{@const hostname = channelHostname(channel.url)}
					{@const description = channelDescription(channel.description)}
					{@const iconSrc = channelImageSrc(channel.imageUrl)}
					{@const coverSrc = channelImageSrc(channel.headerImageUrl)}

					<a class="card column" href={channelDetailHref(channel.id)}>
						<div class="card-cover-slot" aria-hidden={!coverSrc}>
							{#if coverSrc}
								<img
									class="card-cover"
									src={coverSrc}
									alt=""
									width="720"
									height="120"
								/>
							{/if}
						</div>

						<div class="card-main">
							{#if iconSrc}
								<img
									class="channel-icon"
									src={iconSrc}
									alt=""
									width="96"
									height="96"
								/>
							{:else}
								<div class="badge">{channelInitials(channel.name)}</div>
							{/if}

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
		{/each}
	</div>

	<!-- load more disabled: change #if false -> #if data.hasMoreChannels to re-enable -->
	{#if false}
		<p class="more row">
			<a href={`?page=${data.currentPage}&count=${data.visibleCount + CHANNELS_PAGE_SIZE}`}>Load more channels</a>
		</p>
	{/if}
</article>


<style>
	article.channels-page {
		flex: 1;
		min-height: 0;
		width: 100%;
		gap: 1.35em;
	}

	.channels-grid.column {
		flex: 1;
		min-height: 0;
		width: 100%;
		align-items: stretch;
		justify-content: flex-start;
		gap: 0.65em;
	}

	.channels-row.row {
		flex: 1;
		min-height: 0;
		width: 100%;
		align-items: stretch;
		justify-content: flex-start;
		flex-wrap: nowrap;
		gap: 0.65em;
	}

	.channels-row > .card {
		flex: 1 1 0;
		min-width: 0;
		min-height: 0;
	}

	.card {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		align-self: stretch;
		overflow: hidden;
		padding: 0;
		border-radius: 1em;
		background:
			linear-gradient(155deg, rgba(118, 72, 178, 0.28) 0%, transparent 46%),
			linear-gradient(215deg, rgba(0, 0, 0, 0.42) 0%, rgba(32, 14, 52, 0.38) 100%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			rgba(10, 4, 22, 0.52);
		border: 1px solid rgba(200, 170, 255, 0.1);
		color: inherit;
		text-decoration: none;
	}

	.card-cover-slot {
		display: flex;
		width: 100%;
		height: 4.25rem;
		flex-shrink: 0;
		overflow: hidden;
	}

	.card-cover {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.card-main {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: flex-start;
		gap: 0.85em;
		padding: 1.1em;
		flex: 1;
		min-height: 0;
	}

	.channel-icon {
		display: block;
		width: 3rem;
		height: 3rem;
		border-radius: 0.8rem;
		object-fit: cover;
		object-position: center;
		flex-shrink: 0;
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 0.8rem;
		background:
			linear-gradient(140deg, rgba(132, 88, 200, 0.4) 0%, rgba(0, 0, 0, 0.35) 100%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)),
			rgba(24, 10, 44, 0.55);
		border: 1px solid rgba(200, 180, 255, 0.14);
		color: rgba(255, 255, 255, 0.96);
		font-family: 'Fira Code', monospace;
		font-size: 1rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.card-main > .body {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		gap: 0.65em;
		flex: 1;
		min-width: 0;
		min-height: 0;
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
		border: 1px solid rgba(190, 160, 255, 0.16);
		border-radius: 999px;
		background:
			linear-gradient(165deg, rgba(96, 56, 150, 0.35), rgba(0, 0, 0, 0.4)),
			rgba(18, 8, 34, 0.45);
		color: rgba(255, 255, 255, 0.9);
		text-decoration: none;
	}

	.url.row.inline {
		gap: 0.35em;
		flex-wrap: wrap;
	}
</style>
