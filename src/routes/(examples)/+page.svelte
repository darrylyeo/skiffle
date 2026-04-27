<script lang="ts">
	// Assets
	import farcasterLogoUrl from '$lib/assets/branding/farcaster-logo.svg'
	import svelteLogoUrl from '$lib/assets/branding/svelte-logo.svg'
	import banjoEmojiUrl from '$lib/assets/emoji/banjo.svg'
	import snapEmojiUrl from '$lib/assets/emoji/snap.svg'
</script>


<article class="card column">
	<div class="hero-copy column">
		<h1 class="logo" aria-label="SKIFFLE">
			<span class="logo-letter"><span class="svelte">S</span></span>
			<span class="logo-letter"><span class="svelte">K</span></span>
			<span class="logo-letter"><span>I</span></span>
			<span class="logo-letter"><span class="farcaster">F</span></span>
			<span class="logo-letter"><span class="farcaster">F</span></span>
			<span class="logo-letter"><span>L</span></span>
			<span class="logo-letter"><span>E</span></span>
		</h1>

		<h2 class="acronym row wrap">
			<span><b class="svelte">S</b>velte<b class="svelte">K</b>it</span>
			<span><b>I</b>mage-based</span>
			<span><b class="farcaster">F</b>arcaster</span>
			<span><b class="farcaster">F</b>rames</span>
			<span><b>L</b>ayout</span>
			<span><b>E</b>ngine</span>
		</h2>
	</div>

	<nav class="home-cta row" aria-label="Get started">
		<a class="home-cta-btn row" href="/about">
			<svg class="home-cta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<circle cx="12" cy="12" r="10" />
				<path d="M12 16v-4M12 8h.01" />
			</svg>
			About
		</a>
		<form class="home-cta-form" method="POST">
			<button class="home-cta-btn row" type="submit" formaction="?/demos">
				<svg class="home-cta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M8 5v14l11-7z" />
				</svg>
				Demos
			</button>
		</form>
	</nav>

	<p class="callout callout-1">now in a snap!</p>
	<p class="callout callout-2">wowow</p>
	<p class="callout callout-3">needs a better acronym</p>

	<img
		class="decal brand brand-svelte"
		src={svelteLogoUrl}
		alt=""
		aria-hidden="true"
		style="bottom: 26%; left: -1%; width: 7rem; height: 7rem; transform: rotate(-11deg)"
	/>
	<img
		class="decal brand brand-farcaster"
		src={farcasterLogoUrl}
		alt=""
		aria-hidden="true"
		style="top: 13%; right: -1%; width: 7rem; height: 7rem; transform: rotate(9deg)"
	/>

	<span
		class="decal emoji-badge"
		aria-hidden="true"
		style="top: 6%; left: 18%; width: 2.55em; height: 2.55em; transform: rotate(-7deg)"
	>🖼️</span>

	<img
		class="decal emoji-badge emoji-badge-image"
		src={banjoEmojiUrl}
		alt=""
		aria-hidden="true"
		style="bottom: 4%; left: 26%; width: 2.55em; height: 2.55em; transform: rotate(11deg)"
	/>
	<img
		class="decal emoji-badge emoji-badge-image"
		src={snapEmojiUrl}
		alt=""
		aria-hidden="true"
		style="bottom: 33%; right: 19%; width: 2.55em; height: 2.55em; transform: rotate(8deg)"
	/>

	<span class="decal demo" aria-hidden="true" style="bottom: 6%; left: 2%; width: 1.85em; height: 1.85em; transform: rotate(-10deg)">👤</span>
	<span class="decal demo" aria-hidden="true" style="top: 29%; right: 18%; width: 1.85em; height: 1.85em; transform: rotate(8deg)">📻</span>
	<span class="decal demo" aria-hidden="true" style="top: 5%; right: 13%; width: 1.85em; height: 1.85em; transform: rotate(-6deg)">🔢</span>
	<span class="decal demo" aria-hidden="true" style="bottom: 32%; right: 12%; width: 1.85em; height: 1.85em; transform: rotate(7deg)">🪙</span>
	<span class="decal demo" aria-hidden="true" style="bottom: 5%; right: 3%; width: 1.85em; height: 1.85em; transform: rotate(-8deg)">🎨</span>
	<span class="decal demo" aria-hidden="true" style="bottom: 25%; left: 17%; width: 1.85em; height: 1.85em; transform: rotate(10deg)">✂️</span>
	<span class="decal demo" aria-hidden="true" style="top: 21%; left: 11%; width: 1.85em; height: 1.85em; transform: rotate(-9deg)">📽️</span>
	<span class="decal demo" aria-hidden="true" style="top: 10%; left: 4%; width: 1.85em; height: 1.85em; transform: rotate(6deg)">🔠</span>
	<span class="decal demo" aria-hidden="true" style="left: 18%; top: 40%; width: 1.85em; height: 1.85em; transform: rotate(-6deg)">🟩</span>
	<span class="decal demo" aria-hidden="true" style="bottom: 7%; right: 27%; width: 1.85em; height: 1.85em; transform: rotate(9deg)">❎️</span>
</article>


<style>
	article {
		justify-content: center;
		align-items: center;
		text-align: center;
		flex: 1;
	}

	.card {
		position: relative;
		overflow: visible;
		padding: 2.5em 4em;
		border-radius: 1em;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background-color: rgba(9, 7, 22, 0.17);
		background-image:
			radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.075), transparent 38%),
			radial-gradient(circle at 12% 18%, rgba(255, 126, 92, 0.06), transparent 28%),
			radial-gradient(circle at 88% 20%, rgba(138, 99, 210, 0.075), transparent 26%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.022), rgba(255, 255, 255, 0.01));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			0 1em 2.8em rgba(10, 7, 28, 0.18);
		gap: 1.5em;

		text-shadow: 2px 2px 2px rgba(255, 255, 255, 0.14), 0 0 10px rgba(255, 255, 255, 0.18);
	}

	.home-cta {
		position: relative;
		z-index: 3;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.65em;
		margin-top: 0.15em;
	}

	.home-cta-form {
		display: flex;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
	}

	.home-cta-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.4em;
		padding: 0.5em 0.85em 0.48em;
		border: 1px solid rgba(255, 255, 255, 0.22);
		border-radius: 999px;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(14, 11, 30, 0.12));
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
		color: rgba(255, 255, 255, 0.92);
		font-size: 0.95em;
		font-weight: 700;
		letter-spacing: 0.02em;
		text-decoration: none;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.12);
		cursor: pointer;
		font-family: inherit;
	}

	.home-cta-btn:hover {
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(14, 11, 30, 0.1));
		border-color: rgba(255, 255, 255, 0.32);
	}

	.home-cta-icon {
		flex-shrink: 0;
		width: 1.1em;
		height: 1.1em;
		opacity: 0.92;
	}

	.hero-copy {
		position: relative;
		gap: 1.15em;
		align-items: center;
		padding: 0.85em 1.2em;
		border-radius: 1.2em;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(14, 11, 30, 0.04));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05);
	}

	.decal {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		text-shadow: none;
		background-color: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(25px);
		overflow: visible;
	}

	.brand,
	.emoji-badge,
	.demo {
		border: 1px solid rgba(255, 255, 255, 0.16);
		box-shadow: 0 0.6em 1.4em rgba(0, 0, 0, 0.16);
	}

	.brand {
		box-sizing: border-box;
		object-fit: contain;
		padding: 0.7em;
		border-radius: 1em;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.06));
		opacity: 0.82;
	}

	.brand-svelte {
		border-radius: 999px;
		background:
			radial-gradient(circle at 35% 32%, rgba(255, 255, 255, 0.2), transparent 42%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));
		opacity: 0.58;
	}

	.brand-farcaster {
		padding: 0.85em;
		border-radius: 999px;
		background:
			radial-gradient(circle at 35% 32%, rgba(255, 255, 255, 0.14), transparent 42%),
			linear-gradient(180deg, rgba(138, 99, 210, 0.2), rgba(138, 99, 210, 0.08));
	}

	.emoji-badge {
		border-radius: 999px;
		background:
			radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.22), transparent 36%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05));
		font-size: 1.45em;
		line-height: 1;
		font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Noto Emoji', sans-serif;
	}

	.emoji-badge-image {
		padding: 0.38em;
		box-sizing: border-box;
		object-fit: contain;
	}

	.demo {
		border-radius: 999px;
		background:
			radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.18), transparent 36%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
		color: rgba(255, 255, 255, 0.96);
		font-size: 1em;
		line-height: 1;
		opacity: 0.84;
		font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Noto Emoji', sans-serif;
	}

	.callout {
		position: absolute;
		z-index: 2;
		padding: 0.55em 0.9em 0.5em;
		border: 1px solid rgba(255, 255, 255, 0.28);
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(255, 62, 0, 0.95), rgba(138, 99, 210, 0.95));
		box-shadow:
			0 0.6em 1.6em rgba(0, 0, 0, 0.18),
			inset 0 1px 0 rgba(255, 255, 255, 0.18);
		color: rgba(255, 255, 255, 0.96);
		font-size: 0.95em;
		font-weight: 800;
		letter-spacing: 0.08em;
		line-height: 1;
		text-transform: uppercase;
		transform: rotate(8deg);
		text-shadow: none;

		&.callout-1 {
			top: 1.66em;
			right: 9.05em;
		}

		&.callout-2 {
			bottom: 3em;
			left: 6.6em;
			padding-inline: 0.75em;
			font-size: 0.68em;
			letter-spacing: 0.08em;
			background: linear-gradient(135deg, rgba(138, 99, 210, 0.8), rgba(98, 75, 208, 0.72));
			color: rgba(255, 248, 255, 0.92);
			transform: rotate(5deg);
		}

		&.callout-3 {
			bottom: 4.8em;
			right: -1.25em;
			font-size: 0.74em;
			letter-spacing: 0.04em;
			text-transform: none;
			background: linear-gradient(135deg, rgba(255, 164, 110, 0.58), rgba(255, 109, 53, 0.52));
			color: rgba(251, 224, 211, 0.92);
			transform: rotate(-9deg);
		}
	}

	h1 {
		position: relative;
		line-height: 1;
	}

	.logo {
		position: relative;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 0.01em;
		font-size: 4.02em;
		font-weight: 900;
		letter-spacing: 0.04em;
		-webkit-background-clip: text;
		background-clip: text;
		color: rgba(255, 255, 255, 0.5);
	}

	.logo > .logo-letter {
		display: block;
	}

	.logo > .logo-letter > span {
		display: block;
		-webkit-background-clip: text;
		background-clip: text;
	}

	h2 {
		position: relative;
		width: 13em;
		gap: 0.5em;
		justify-content: center;
		align-items: center;

		font-size: 1.5em;
		font-weight: 300;
		letter-spacing: -0.025em;
		color: rgba(255, 255, 255, 0.75);
	}

	b {
		-webkit-background-clip: text;
		background-clip: text;
		background-image: linear-gradient(to right, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75));
		color: rgba(255, 255, 255, 0.25);
	}

	.svelte {
		-webkit-background-clip: text;
		background-clip: text;
		background-image: linear-gradient(to right, #ff3e00, #ff3e00);
	}
	.farcaster {
		-webkit-background-clip: text;
		background-clip: text;
		background-image: linear-gradient(to right, #8a63d2, #8a63d2);
	}
</style>
