<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	const castContent = (content: string) => (
		content
			.replaceAll(/\s+/g, ' ')
			.trim()
			.slice(0, 220)
	)

	const castDate = (timestamp: number) => (
		new Date(timestamp).toLocaleString()
	)

	// Props
	let { data }: { data: PageData } = $props()
</script>


<article class="column">
	<section class="hero column">
		{#if data.channel.headerImageUrl}
			<img class="banner" src={data.channel.headerImageUrl} alt="" />
		{/if}

		<div class="hero-body column">
			<div class="row hero-top">
				<div class="row inline identity">
					{#if data.channel.imageUrl}
						<img class="icon" src={data.channel.imageUrl} alt={`${data.channel.name} icon`} />
					{/if}

					<div class="column">
						<h2>/{data.channel.key}</h2>
						<p class="annotation">{data.channel.name}</p>
					</div>
				</div>

				<p class="annotation row inline wrap stats">
					<span><strong>{data.channel.followerCount.toLocaleString()}</strong> followers</span>
					<span>·</span>
					<span><strong>{data.channel.memberCount.toLocaleString()}</strong> members</span>
				</p>
			</div>

			<p class="description">{data.channel.description}</p>

			{#if data.channel.lead}
				<div class="lead row inline">
					{#if data.channel.lead.pfpUrl}
						<img class="lead-avatar" src={data.channel.lead.pfpUrl} alt={`${data.channel.lead.displayName} avatar`} />
					{/if}

					<p class="annotation">
						Lead by <strong>{data.channel.lead.displayName}</strong> @{data.channel.lead.username}
					</p>
				</div>
			{/if}
		</div>
	</section>

	<section class="column casts">
		<header class="row">
			<h3>Recent casts</h3>
			<p class="annotation">{data.displayCasts.length} shown</p>
		</header>

		{#if data.displayCasts.length > 0}
			<div class="column list">
				{#each data.displayCasts as cast (cast.hash)}
					{@const content = castContent(cast.content)}

					<article class="cast column">
						<div class="row cast-top">
							<div class="row inline identity">
								<img class="lead-avatar" src={cast.authorPfpUrl} alt={`${cast.authorDisplayName} avatar`} />

								<div class="column">
									<p><strong>{cast.authorDisplayName}</strong> @{cast.authorUsername}</p>
									<p class="annotation">{castDate(cast.timestamp)}</p>
								</div>
							</div>

							<p class="annotation row inline wrap counts">
								<span>{cast.replyCount} replies</span>
								<span>·</span>
								<span>{cast.reactionCount} reacts</span>
								<span>·</span>
								<span>{cast.recastCount} recasts</span>
							</p>
						</div>

						<p class="content">
							{content}{content.length < cast.content.trim().length ? '...' : ''}
						</p>
					</article>
				{/each}
			</div>

			{#if data.hasMoreCasts}
				<p class="more row">
					<a href={`?count=${data.visibleCount + 5}`}>Load more casts</a>
				</p>
			{/if}
		{:else}
			<p class="annotation empty">No casts available yet.</p>
		{/if}
	</section>
</article>


<style>
	article {
		gap: 1.5em;
	}

	.hero {
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1em;
		background: rgba(35, 17, 61, 0.24);
	}

	.banner {
		width: 100%;
		height: 10rem;
		object-fit: cover;
	}

	.hero-body {
		padding: 1.15em;
		gap: 0.9em;
	}

	.hero-top {
		align-items: flex-start;
	}

	.identity {
		gap: 0.75em;
		align-items: center;
	}

	.icon {
		width: 4rem;
		height: 4rem;
		border-radius: 0.9rem;
	}

	.lead-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
	}

	.description {
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.85);
	}

	.annotation {
		color: rgba(255, 255, 255, 0.7);
	}

	.stats,
	.counts {
		justify-content: flex-end;
	}

	.casts {
		gap: 1em;
	}

	.list {
		gap: 0.85em;
	}

	.cast {
		gap: 0.8em;
		padding: 1em;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 1em;
		background: rgba(255, 255, 255, 0.05);
	}

	.cast-top {
		align-items: flex-start;
	}

	.content {
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.9);
	}

	.more,
	.empty {
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
</style>
