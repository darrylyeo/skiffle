<script lang="ts">
	// Components
	import AbstractArtBackground from '$lib/AbstractArtBackground.svelte'

	// Assets
	import farcasterLogoUrl from '$lib/assets/branding/farcaster-logo.svg'
	import svelteLogoUrl from '$lib/assets/branding/svelte-logo.svg'

	// Functions
	import { abstractArtBackgroundView } from './demos/abstract-art/abstract-art-frame'

	const background = abstractArtBackgroundView(10871, 2)
</script>


<article class="card column">
	<AbstractArtBackground {background} />

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

	<p class="sticker sticker-main">now in a snap!</p>
	<p class="sticker sticker-idea">probably needs a better acronym now</p>
	<p class="sticker sticker-wowow">wowow</p>

	{#each [
		{
			src: svelteLogoUrl,
			className: 'decal brand brand-svelte',
			style: 'top:2.5em;left:-1em;width:9.9em;transform:rotate(-11deg);',
		},
		{
			src: farcasterLogoUrl,
			className: 'decal brand brand-farcaster',
			style: 'top:5.5em;right:-0.5em;width:9em;transform:rotate(9deg);',
		},
	] as decal (decal.className)}
		<img class={decal.className} src={decal.src} alt="" aria-hidden="true" style={decal.style} />
	{/each}

	{#each [
		{
			content: '🖼️',
			className: 'decal emoji-badge emoji-frame',
			style: 'top:8em;left:12.8em;transform:rotate(-7deg);',
		},
		{
			content: '🫰',
			className: 'decal emoji-badge emoji-snap',
			style: 'top:2.2em;right:10.35em;transform:rotate(11deg);',
		},
		{
			content: '🪕',
			className: 'decal emoji-badge emoji-banjo',
			style: 'bottom:1.65em;right:2.6em;transform:rotate(8deg);',
		},
	] as decal (decal.className)}
		<span class={decal.className} aria-hidden="true" style={decal.style}>{decal.content}</span>
	{/each}

	{#each [
		{
			content: '👤',
			style: 'top:12.2em;left:1.2em;transform:rotate(-10deg);',
		},
		{
			content: '📻',
			style: 'top:4.85em;left:13.2em;transform:rotate(8deg);',
		},
		{
			content: '🔢',
			style: 'top:2.35em;left:19.35em;transform:rotate(-6deg);',
		},
		{
			content: '🪙',
			style: 'top:10.75em;right:1.35em;transform:rotate(7deg);',
		},
		{
			content: '🎨',
			style: 'bottom:5.1em;right:6.25em;transform:rotate(-8deg);',
		},
		{
			content: '✊️',
			style: 'bottom:3.55em;left:9.2em;transform:rotate(10deg);',
		},
		{
			content: '❎️',
			style: 'bottom:7.15em;left:2.4em;transform:rotate(-9deg);',
		},
		{
			content: '🔠',
			style: 'top:8.55em;left:5.1em;transform:rotate(6deg);',
		},
		{
			content: '🟩',
			style: 'bottom:8.25em;right:2.45em;transform:rotate(-6deg);',
		},
		{
			content: '📽️',
			style: 'bottom:2.7em;right:11.15em;transform:rotate(9deg);',
		},
	] as decal (`${decal.content}:${decal.style}`)}
		<span class="decal demo-spark" aria-hidden="true" style={decal.style}>{decal.content}</span>
	{/each}
</article>


<style>
	article {
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.card {
		position: relative;
		padding: 2.95em 4.4em 3.3em;
		border-radius: 1em;
		background: radial-gradient(circle, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.075));
		gap: 1.5em;

		text-shadow: 2px 2px 2px rgba(255, 255, 255, 0.14), 0 0 10px rgba(255, 255, 255, 0.18);
	}

	.hero-copy {
		position: relative;
		z-index: 2;
		gap: 1.15em;
		align-items: center;
	}

	.decal {
		position: absolute;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		text-shadow: none;
	}

	.brand,
	.emoji-badge,
	.demo-spark {
		border: 1px solid rgba(255, 255, 255, 0.16);
		box-shadow: 0 0.6em 1.4em rgba(0, 0, 0, 0.16);
	}

	.brand {
		padding: 0.7em;
		border-radius: 1em;
		background: rgba(255, 255, 255, 0.08);
		opacity: 0.82;
	}

	.brand-svelte {
		background: rgba(255, 255, 255, 0.09);
	}

	.brand-farcaster {
		padding: 0.85em;
		border-radius: 999px;
		background: rgba(138, 99, 210, 0.12);
	}

	.emoji-badge {
		width: 2.55em;
		height: 2.55em;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		font-size: 1.45em;
		line-height: 1;
		font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Noto Emoji', sans-serif;
	}

	.demo-spark {
		width: 1.85em;
		height: 1.85em;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.96);
		font-size: 1em;
		line-height: 1;
		opacity: 0.92;
		font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Noto Emoji', sans-serif;
	}

	.sticker {
		position: absolute;
		z-index: 2;
		padding: 0.55em 0.9em 0.5em;
		border: 1px solid rgba(255, 255, 255, 0.28);
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(255, 62, 0, 0.95), rgba(138, 99, 210, 0.95));
		box-shadow: 0 0.6em 1.6em rgba(0, 0, 0, 0.22);
		color: rgba(255, 255, 255, 0.96);
		font-size: 0.95em;
		font-weight: 800;
		letter-spacing: 0.08em;
		line-height: 1;
		text-transform: uppercase;
		transform: rotate(8deg);
		text-shadow: none;
	}

	.sticker-main {
		top: 1.15em;
		right: 9.05em;
	}

	.sticker-idea {
		bottom: 1.15em;
		right: 1.2em;
		font-size: 0.74em;
		letter-spacing: 0.04em;
		text-transform: none;
		background: linear-gradient(135deg, rgba(255, 164, 110, 0.78), rgba(255, 109, 53, 0.72));
		color: rgba(51, 24, 11, 0.92);
		transform: rotate(6deg);
	}

	.sticker-wowow {
		bottom: 1.2em;
		left: 1.2em;
		padding-inline: 0.75em;
		font-size: 0.68em;
		letter-spacing: 0.08em;
		background: linear-gradient(135deg, rgba(138, 99, 210, 0.8), rgba(98, 75, 208, 0.72));
		color: rgba(255, 248, 255, 0.92);
		transform: rotate(-9deg);
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
