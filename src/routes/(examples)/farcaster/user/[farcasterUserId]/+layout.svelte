<script lang="ts">
	// Types
	import type { Snippet } from 'svelte'
	import type { PageData } from './$types'

	// Context
	import { page } from '$app/state'


	// Props
	const {
		children,
		data,
	}: {
		children: Snippet,
		data: PageData,
	} = $props()


	// State
	let walletTotal = $derived(
		data.user.eth_wallet_count
		+ data.user.solana_wallet_count
	)


	// Functions
	const formatCount = (n: number) => (
		n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
		: n >= 1000 ? `${(n / 1000).toFixed(1)}K`
		: String(n)
	)

	const isCastsSubroute = $derived(
		(page.route.id ?? '').includes('(withBackButton)/casts')
		|| /\/casts\/?$/.test(page.url.pathname),
	)

</script>


{#if isCastsSubroute}
	<div class="user-casts-root column">
		{@render children()}
	</div>
{:else}
<article class="profile column">
	<div class="profile-hero column">
		<div class="profile-top row wrap">
			<div class="profile-identity row">
				<img
					class="profile-avatar"
					src={data.user.pfp_url}
					alt=""
				/>

				<div class="profile-names column">
					<h2 class="profile-display-name">
						{data.user.display_name}
					</h2>

					<div class="profile-handle-row row inline wrap">
						<span class="profile-handle">
							@{data.user.username}
						</span>

						{#if data.user.pfp_verified}
							<span class="profile-chip is-verified">
								Verified
							</span>
						{/if}

						{#if data.user.account_level}
							<span class="profile-chip is-level">
								{data.user.account_level}
							</span>
						{/if}

						{#if data.user.early_wallet_adopter}
							<span class="profile-chip is-early">
								Early wallet adopter
							</span>
						{/if}
					</div>

					{#if data.user.profile_url}
						<a
							class="profile-site"
							href={data.user.profile_url}
							rel="noopener noreferrer"
							target="_blank"
						>
							{data.user.profile_url}
						</a>
					{/if}
				</div>
			</div>

			<div class="profile-fid column">
				<span class="profile-fid-label">
					FID
				</span>

				<span class="profile-fid-value">
					#{data.user.fid}
				</span>
			</div>
		</div>

		{#if data.user.bio}
			<p class="profile-bio">
				{data.user.bio}
			</p>
		{/if}

		<div class="profile-stats column">
			<div class="profile-stats-primary row">
				<div class="stat-tile column">
					<span class="stat-label">
						Followers
					</span>

					<span class="stat-value">
						{formatCount(data.user.follower_count)}
					</span>
				</div>

				<div class="stat-tile column">
					<span class="stat-label">
						Following
					</span>

					<span class="stat-value">
						{formatCount(data.user.following_count)}
					</span>
				</div>

				<div class="stat-tile column">
					<span class="stat-label">
						Follow ratio
					</span>

					<span class="stat-value">
						{(
							data.user.following_count > 0
								? (data.user.follower_count / data.user.following_count).toFixed(1)
								: '-'
						)}
					</span>
				</div>
			</div>

			{#if walletTotal > 0 || data.user.custody_address_short || data.user.collections_owned_count > 0}
				<div class="profile-stats-extra row wrap">
					{#if walletTotal > 0}
						<div class="stat-tile column">
							<span class="stat-label">
								Onchain wallets
							</span>

							<span class="stat-value">
								{walletTotal}
							</span>
						</div>
					{/if}

					{#if data.user.custody_address_short}
						<div class="stat-tile column">
							<span class="stat-label">
								Custody
							</span>

							<span class="stat-value stat-value--mono">
								{data.user.custody_address_short}
							</span>
						</div>
					{/if}

					{#if data.user.collections_owned_count > 0}
						<div class="stat-tile column">
							<span class="stat-label">
								Collections
							</span>

							<span class="stat-value">
								{data.user.collections_owned_count}
							</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	{@render children()}
</article>
{/if}


<style>
	.user-casts-root {
		flex: 1;
		min-height: 0;
		width: 100%;
	}

	.profile {
		flex: 1;
		row-gap: 1.25em;
	}

	.profile-hero {
		flex-grow: 1;
		flex-shrink: 0;
		padding: 1.35em 1.5em;
		border-radius: 22px;
		border: 1px solid rgba(200, 175, 255, 0.18);
		/* Solid only — Satori’s bundled css-gradient-parser throws on some linear-gradient() in dev SSR */
		background-color: rgb(58, 38, 98);
		box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
		row-gap: 1.1em;
		justify-content: space-between;
	}

	.profile-top {
		align-items: flex-start;
		justify-content: space-between;
		column-gap: 1.25em;
		row-gap: 1em;
	}

	.profile-identity {
		flex: 1;
		align-items: flex-start;
		justify-content: flex-start;
		column-gap: 1.15em;
		min-width: 0;
	}

	.profile-avatar {
		flex-shrink: 0;
		width: 5.5em;
		height: 5.5em;
		border-radius: 20px;
		border: 3px solid rgba(255, 255, 255, 0.45);
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
		object-fit: cover;
	}

	.profile-names {
		flex: 1;
		min-width: 0;
		align-items: flex-start;
		row-gap: 0.45em;
	}

	.profile-display-name {
		font-size: 1.65em;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: #fff;
	}

	.profile-handle-row {
		flex-wrap: wrap;
	}

	.profile-handle {
		font-size: 1.05em;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.88);
	}

	.profile-chip {
		padding: 0.2em 0.55em;
		border-radius: 999px;
		font-size: 0.72em;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		border: 1px solid rgba(255, 255, 255, 0.35);
		background-color: rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.95);
	}

	.profile-chip.is-level {
		background-color: rgba(138, 99, 210, 0.55);
		border-color: rgba(255, 255, 255, 0.4);
	}

	.profile-chip.is-early {
		background-color: rgba(255, 62, 0, 0.45);
		border-color: rgba(255, 255, 255, 0.35);
	}

	.profile-chip.is-verified {
		background-color: rgba(40, 200, 120, 0.35);
		border-color: rgba(255, 255, 255, 0.35);
	}

	.profile-site {
		font-size: 0.88em;
		font-weight: 600;
		color: rgba(200, 220, 255, 0.95);
		text-decoration: underline;
		text-underline-offset: 0.15em;
		overflow-wrap: anywhere;
	}

	.profile-fid {
		flex-shrink: 0;
		align-items: flex-end;
		padding: 0.5em 0.85em;
		border-radius: 14px;
		background-color: rgb(78, 54, 122);
		border: 1px solid rgba(190, 165, 255, 0.16);
		row-gap: 0.2em;
	}

	.profile-fid-label {
		font-size: 0.65em;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}

	.profile-fid-value {
		font-size: 1.35em;
		font-weight: 700;
		font-family: 'Fira Code', monospace;
		color: #fff;
	}

	.profile-bio {
		font-size: 0.92em;
		line-height: 1.45;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.88);
		max-height: 4.5em;
		overflow: hidden;
	}

	.profile-stats {
		row-gap: 0.65em;
		width: 100%;
	}

	.profile-stats-primary {
		width: 100%;
		column-gap: 0.65em;
	}

	.profile-stats-primary .stat-tile {
		flex: 1 1 0;
		min-width: 0;
		max-width: none;
	}

	.profile-stats-extra {
		justify-content: flex-start;
		column-gap: 0.65em;
		row-gap: 0.65em;
	}

	.stat-tile {
		min-width: 7.5em;
		max-width: 11em;
		flex-grow: 1;
		flex-shrink: 1;
		padding: 0.65em 0.75em;
		border-radius: 14px;
		background-color: rgb(70, 48, 110);
		border: 1px solid rgba(190, 165, 255, 0.12);
		row-gap: 0.2em;
		align-items: flex-start;
	}

	.stat-label {
		font-size: 0.68em;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}

	.stat-value {
		font-size: 1.25em;
		font-weight: 700;
		font-family: 'Fira Code', monospace;
		color: #fff;
	}

	.stat-value--mono {
		font-size: 0.95em;
		letter-spacing: -0.02em;
	}
</style>
