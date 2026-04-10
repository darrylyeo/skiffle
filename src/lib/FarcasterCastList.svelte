<script lang="ts">
	// Types/constants
	import type { DemoFarcasterCast } from './farcaster-casts'

	// Functions
	import { farcasterCastContent, farcasterCastDate, farcasterInitials } from './farcaster-casts'

	// Props
	let {
		casts,
		emptyLabel = 'No casts available yet.',
		isFrameImage = false,
	}: {
		casts: DemoFarcasterCast[]
		emptyLabel?: string
		isFrameImage?: boolean
	} = $props()
</script>


{#if casts.length > 0}
	<div class="column list">
		{#each casts as cast (cast.hash)}
			{@const content = farcasterCastContent(cast.content)}

			<article class="cast column">
				<header class="row cast-top">
					<div class="row inline identity">
						{#if !isFrameImage}
							<img class="avatar" src={cast.authorPfpUrl} alt={`${cast.authorDisplayName} avatar`} />
						{:else}
							<div class="avatar avatar-placeholder" aria-hidden="true">
								<span class="initials">{farcasterInitials(cast.authorDisplayName, cast.authorUsername)}</span>
							</div>
						{/if}

						<div class="column author">
							<p><strong>{cast.authorDisplayName}</strong> @{cast.authorUsername}</p>
							<p class="annotation">{farcasterCastDate(cast.timestamp)}</p>
						</div>
					</div>
				</header>

				<p class="content">
					{content}{content.length < cast.content.trim().length ? '...' : ''}
				</p>

				<p class="annotation row inline wrap counts">
					<span>{cast.replyCount} replies</span>
					<span>{cast.reactionCount} reacts</span>
					<span>{cast.recastCount} recasts</span>
				</p>
			</article>
		{/each}
	</div>
{:else}
	<p class="annotation empty">{emptyLabel}</p>
{/if}


<style>
	.list {
		gap: 0.9em;
	}

	.cast {
		gap: 0.9em;
		padding: 1em;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 1em;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03)),
			rgba(255, 255, 255, 0.03);
	}

	.cast-top {
		align-items: flex-start;
		gap: 0.75em;
	}

	.identity {
		flex: 1;
		gap: 0.75em;
		align-items: center;
	}

	.author {
		gap: 0.2em;
		min-width: 0;
	}

	.avatar {
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 999px;
		flex-shrink: 0;
	}

	.avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.6rem;
		font-weight: 600;
		letter-spacing: 0.06em;
	}

	.initials {
		line-height: 1;
	}

	p {
		line-height: 1.35;
	}

	.annotation {
		color: rgba(255, 255, 255, 0.68);
	}

	.content {
		color: rgba(255, 255, 255, 0.92);
		line-height: 1.5;
	}

	.counts {
		gap: 0.45em;
	}

	.counts > span {
		padding: 0.28em 0.6em;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.empty {
		justify-content: center;
	}
</style>
