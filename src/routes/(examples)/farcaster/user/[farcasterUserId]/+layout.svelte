<script lang="ts">
	// Types
	import type { Snippet } from 'svelte'
	import type { PageData } from './$types'


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
		new Intl.NumberFormat(
			'en-US',
			{
				notation: 'compact',
				compactDisplay: 'short',
				maximumFractionDigits: 1,
			},
		)
			.format(n)
	)
</script>


<article class="profile column">
	<div class="profile-hero column">
		<div class="profile-top row wrap">
			<div class="profile-identity row">
				<div class="profile-avatar-wrap">
					<img
						class="profile-avatar"
						src={data.user.pfp_url}
						alt=""
					/>

					{#if data.user.pfp_verified}
						<span class="profile-verified" aria-hidden="true">
							✓
						</span>
					{/if}
				</div>

				<div class="profile-names column">
					<h2 class="profile-display-name">
						{data.user.display_name}
					</h2>

					<div class="profile-handle-row row inline wrap">
						<span class="profile-handle">
							@{data.user.username}
						</span>

						{#if data.user.account_level}
							<span class="profile-chip profile-chip--level">
								{data.user.account_level}
							</span>
						{/if}

						{#if data.user.early_wallet_adopter}
							<span class="profile-chip profile-chip--early">
								Early
							</span>
						{/if}
					</div>

					{#if data.user.profile_url_hostname}
						<p class="profile-site">
							{data.user.profile_url_hostname}
						</p>
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

		<div class="profile-stats row wrap">
			<div class="stat-tile column">
				<span class="stat-label">
					Followers
				</span>

				<span class="stat-value">
					{formatCount(data.user.follower_count)}
				</span>

				<span class="stat-hint">
					{data.user.follower_count.toLocaleString('en-US')}
				</span>
			</div>

			<div class="stat-tile column">
				<span class="stat-label">
					Following
				</span>

				<span class="stat-value">
					{formatCount(data.user.following_count)}
				</span>

				<span class="stat-hint">
					{data.user.following_count.toLocaleString('en-US')}
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
							: '—'
					)}
				</span>

				<span class="stat-hint">
					followers ÷ following
				</span>
			</div>

			<div class="stat-tile column">
				<span class="stat-label">
					Linked accounts
				</span>

				<span class="stat-value">
					{data.user.connected_account_count}
				</span>
			</div>

			{#if walletTotal > 0}
				<div class="stat-tile column">
					<span class="stat-label">
						Onchain wallets
					</span>

					<span class="stat-value">
						{walletTotal}
					</span>

					<span class="stat-hint">
						{data.user.eth_wallet_count} ETH · {data.user.solana_wallet_count} SOL
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
	</div>

	{@render children()}
</article>


<style>
	.profile {
		flex: 1;
		min-height: 0;
		row-gap: 1.25em;
	}

	.profile-hero {
		padding: 1.35em 1.5em;
		border-radius: 22px;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background-color: rgba(0, 0, 0, 0.38);
		background-image: linear-gradient(
			165deg,
			rgba(255, 255, 255, 0.14) 0%,
			rgba(0, 0, 0, 0.12) 55%,
			rgba(138, 99, 210, 0.35) 100%
		);
		box-shadow:
			0 4px 0 rgba(0, 0, 0, 0.2),
			0 22px 48px rgba(0, 0, 0, 0.35);
		row-gap: 1.1em;
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

	.profile-avatar-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.profile-avatar {
		width: 5.5em;
		height: 5.5em;
		border-radius: 20px;
		border: 3px solid rgba(255, 255, 255, 0.45);
		box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
		object-fit: cover;
	}

	.profile-verified {
		position: absolute;
		right: -0.2em;
		bottom: -0.2em;
		min-width: 1.35em;
		height: 1.35em;
		padding: 0 0.35em;
		border-radius: 999px;
		background-image: linear-gradient(135deg, #8a63d2, #ff3e00);
		border: 2px solid rgba(255, 255, 255, 0.9);
		font-size: 0.72em;
		font-weight: 700;
		line-height: 1.35em;
		text-align: center;
		color: #fff;
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
		text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
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

	.profile-chip--level {
		background-color: rgba(138, 99, 210, 0.55);
		border-color: rgba(255, 255, 255, 0.4);
	}

	.profile-chip--early {
		background-color: rgba(255, 62, 0, 0.45);
		border-color: rgba(255, 255, 255, 0.35);
	}

	.profile-site {
		font-size: 0.88em;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.78);
	}

	.profile-fid {
		flex-shrink: 0;
		align-items: flex-end;
		padding: 0.5em 0.85em;
		border-radius: 14px;
		background-color: rgba(0, 0, 0, 0.35);
		border: 1px solid rgba(255, 255, 255, 0.22);
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
		justify-content: flex-start;
		column-gap: 0.65em;
		row-gap: 0.65em;
	}

	.stat-tile {
		min-width: 7.5em;
		flex: 1 1 7.5em;
		max-width: 11em;
		padding: 0.65em 0.75em;
		border-radius: 14px;
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
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

	.stat-hint {
		font-size: 0.68em;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.55);
	}
</style>
