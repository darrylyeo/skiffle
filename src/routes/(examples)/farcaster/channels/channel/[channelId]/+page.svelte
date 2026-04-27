<script lang="ts">
	// Types/constants
	import FarcasterCastList from '$/lib/FarcasterCastList.svelte'
	import { farcasterInitials } from '$/lib/farcaster-casts'
	import { resolve } from '$app/paths'
	import type { PageData } from './$types'

	// Props
	let { data }: { data: PageData } = $props()
</script>


<article class="column">
	<section class="hero column">
		{#if data.channel.headerImageUrl}
			<img class="banner" src={data.channel.headerImageUrl} alt="" />
		{:else}
			<div class="banner banner-placeholder" role="presentation"></div>
		{/if}

		<div class="hero-body column">
			<div class="row hero-top">
				<div class="row inline identity">
					{#if data.channel.imageUrl}
						<img class="icon" src={data.channel.imageUrl} alt={`${data.channel.name} icon`} />
					{:else}
						<div class="icon icon-placeholder" aria-hidden="true">
							<span class="initials">{farcasterInitials(data.channel.name, data.channel.key)}</span>
						</div>
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
					{:else}
						<div class="lead-avatar avatar-placeholder" aria-hidden="true">
							<span class="initials">{farcasterInitials(data.channel.lead.displayName, data.channel.lead.username)}</span>
						</div>
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

		<FarcasterCastList casts={data.displayCasts} />

		{#if data.hasMoreCasts}
			<form class="more row" method="GET" action={resolve('/(examples)/farcaster/channels/channel/[channelId]', {
				channelId: data.channel.id,
			})}>
				<button name="count" value={data.visibleCount + 5}>Load more casts</button>
			</form>
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

	.banner-placeholder {
		flex-shrink: 0;
		background: linear-gradient(
			125deg,
			rgba(140, 90, 220, 0.55) 0%,
			rgba(45, 22, 78, 0.95) 45%,
			rgba(90, 50, 160, 0.5) 100%
		);
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

	.icon-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-sizing: border-box;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.92);
		font-size: 1rem;
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.lead-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 999px;
	}

	.avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-sizing: border-box;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.06em;
	}

	.initials {
		line-height: 1;
	}

	.description {
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.85);
	}

	.annotation {
		color: rgba(255, 255, 255, 0.7);
	}

	.stats {
		justify-content: flex-end;
	}

	.casts {
		gap: 1em;
	}

	.more {
		justify-content: center;
	}

	.more button {
		padding: 0.75em 1.1em;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.9);
		font: inherit;
		cursor: pointer;
	}
</style>
