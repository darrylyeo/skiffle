<script lang="ts">
	// Types/constants
	import FarcasterCastList from '$/lib/FarcasterCastList.svelte'
	import { farcasterInitials } from '$/lib/farcaster-casts'
	import { CHANNEL_CASTS_WEB_STEP } from './channel-frame'
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

		<!-- load more disabled: change #if false -> #if data.hasMoreCasts to re-enable -->
		{#if false}
			<form class="more row" method="GET" action={resolve('/(examples)/farcaster/channels/channel/[channelId]', {
				channelId: data.channel.id,
			})}>
				<button name="count" value={data.visibleCount + CHANNEL_CASTS_WEB_STEP}>Load more casts</button>
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
		border: 1px solid rgba(190, 165, 255, 0.12);
		border-radius: 1em;
		background:
			linear-gradient(175deg, rgba(0, 0, 0, 0.32) 0%, rgba(48, 26, 78, 0.38) 100%),
			linear-gradient(125deg, rgba(100, 62, 160, 0.22) 0%, transparent 45%),
			rgba(12, 6, 26, 0.55);
	}

	.banner {
		width: 100%;
		height: 6.5rem;
		object-fit: cover;
	}

	.banner-placeholder {
		flex-shrink: 0;
		background:
			linear-gradient(118deg, rgba(72, 38, 118, 0.45) 0%, transparent 42%),
			linear-gradient(210deg, rgba(0, 0, 0, 0.55) 0%, rgba(40, 20, 68, 0.4) 100%),
			linear-gradient(125deg, rgba(110, 72, 168, 0.35) 0%, rgba(14, 6, 28, 0.75) 100%);
	}

	.hero-body {
		padding: 0.85em 1em;
		gap: 0.65em;
	}

	.hero-top {
		align-items: flex-start;
	}

	.identity {
		gap: 0.6em;
		align-items: center;
	}

	.icon {
		width: 3rem;
		height: 3rem;
		border-radius: 0.7rem;
	}

	.icon-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		box-sizing: border-box;
		border: 1px solid rgba(190, 165, 255, 0.14);
		background:
			linear-gradient(145deg, rgba(100, 62, 155, 0.38), rgba(0, 0, 0, 0.35)),
			rgba(20, 10, 40, 0.5);
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
		border: 1px solid rgba(190, 165, 255, 0.14);
		background:
			linear-gradient(145deg, rgba(92, 58, 148, 0.4), rgba(0, 0, 0, 0.38)),
			rgba(18, 8, 36, 0.52);
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.55rem;
		font-weight: 600;
		letter-spacing: 0.06em;
	}

	.initials {
		line-height: 1;
	}

	.description {
		margin: 0;
		line-height: 1.35;
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.95em;
	}

	.annotation {
		color: rgba(255, 255, 255, 0.7);
	}

	.stats {
		justify-content: flex-end;
		font-size: 0.9em;
	}

	.casts {
		gap: 1em;
	}

	.more {
		justify-content: center;
	}

	.more button {
		padding: 0.75em 1.1em;
		border: 1px solid rgba(190, 160, 255, 0.16);
		border-radius: 999px;
		background:
			linear-gradient(165deg, rgba(88, 52, 145, 0.38), rgba(0, 0, 0, 0.42)),
			rgba(16, 6, 32, 0.48);
		color: rgba(255, 255, 255, 0.9);
		font: inherit;
		cursor: pointer;
	}
</style>
