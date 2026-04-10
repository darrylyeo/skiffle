<script lang="ts">
	// Types/constants
	import type { DemoChannel } from '../api/farcaster-client'

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

	type Props = {
		data: {
			displayChannels: DemoChannel[]
		}
	}

	// Props
	let { data }: Props = $props()
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

			<section class="card column">
				<div class="badge">{channelInitials(channel.name)}</div>

				<div class="body column">
					<p class="url row inline">
						<strong>{channel.name}</strong>
						<span>{hostname}</span>
					</p>

					<p class="annotation row inline wrap">
						<span><strong>{channel.followerCount.toLocaleString()}</strong> followers</span>
						<span>·</span>
						<span><strong>{channel.memberCount.toLocaleString()}</strong> members</span>
					</p>

					<p class="description">
						{description}{description.length < channel.description.trim().length ? '...' : ''}
					</p>
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
		justify-content: flex-start;
		padding: 1.1em;
		border-radius: 1em;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.03)),
			rgba(35, 17, 61, 0.3);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 0.8rem;
		background:
			linear-gradient(135deg, rgba(255, 173, 113, 0.34), rgba(138, 99, 210, 0.2)),
			rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.96);
		font-family: 'Fira Code', monospace;
		font-size: 1rem;
		font-weight: 700;
	}

	.card > .body {
		gap: 0.65em;
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

	.url.row.inline {
		gap: 0.35em;
		flex-wrap: wrap;
	}
</style>
