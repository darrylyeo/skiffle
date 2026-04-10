<article class="card column">
	<p class="sticker sticker-main">now with snaps!</p>
	<p class="sticker sticker-idea">Needs better acronym</p>

	<h1 class="logo" aria-label="SKIFFLE">
		<span class="svelte">S</span>
		<span class="svelte">K</span>
		<span>I</span>
		<span class="farcaster">F</span>
		<span class="farcaster">F</span>
		<span>L</span>
		<span>E</span>
	</h1>

	<h2 class="acronym row wrap">
		<span><b class="svelte">S</b>velte<b class="svelte">K</b>it</span>
		<span><b>I</b>mage-based</span>
		<span><b class="farcaster">F</b>arcaster</span>
		<span><b class="farcaster">F</b>rames</span>
		<span><b>L</b>ayout</span>
		<span><b>E</b>ngine</span>
	</h2>
</article>


<style>
	article {
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.card {
		position: relative;
		padding: 2.25em;
		border-radius: 1em;
		background: radial-gradient(circle, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.075));
		gap: 1.5em;

		text-shadow: 2px 2px 2px rgba(255, 255, 255, 0.14), 0 0 10px rgba(255, 255, 255, 0.18);
	}

	.sticker {
		position: absolute;
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
		top: 1.35em;
		right: 1.35em;
	}

	.sticker-idea {
		bottom: 1.15em;
		left: 1.15em;
		font-size: 0.72em;
		letter-spacing: 0.04em;
		text-transform: none;
		transform: rotate(-5deg);
	}

	h1 {
		line-height: 1;
	}

	.logo {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 0.01em;
		font-size: 3.75em;
		font-weight: 900;
		letter-spacing: 0.04em;
		-webkit-background-clip: text;
		background-clip: text;
		color: rgba(255, 255, 255, 0.5);
	}

	.logo > span {
		display: block;
		-webkit-background-clip: text;
		background-clip: text;
		transform-origin: center 80%;
	}

	.logo > span:nth-child(1) {
		transform: translateY(0.04em) rotate(-8deg) scale(1.02, 0.96);
	}

	.logo > span:nth-child(2) {
		transform: translateY(-0.01em) rotate(7deg) scale(0.96, 1.04);
	}

	.logo > span:nth-child(3) {
		transform: translateY(0.06em) rotate(-5deg) scale(0.84, 1.1);
	}

	.logo > span:nth-child(4) {
		transform: translateY(-0.01em) rotate(6deg) scale(1.01, 0.98);
	}

	.logo > span:nth-child(5) {
		transform: translateY(0.03em) rotate(-6deg) scale(0.98, 1.04);
	}

	.logo > span:nth-child(6) {
		transform: translateY(-0.02em) rotate(5deg) scale(0.92, 1.03);
	}

	.logo > span:nth-child(7) {
		transform: translateY(0.04em) rotate(-7deg) scale(1.03, 0.97);
	}

	h2 {
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
