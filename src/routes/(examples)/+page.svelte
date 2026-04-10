<article class="card column">
	<p class="sticker sticker-main">now with snaps!</p>
	<p class="sticker sticker-idea">Needs better acronym</p>

	<h1 class="logo" aria-label="SKIFFLE">
		<span>S</span>
		<span>K</span>
		<span>I</span>
		<span>F</span>
		<span>F</span>
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

		text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.15), 0 0 10px rgba(0, 0, 0, 0.25);
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
		gap: 0.02em;

		font-size: clamp(3.8rem, 11vw, 5.8rem);
		font-weight: 900;
		letter-spacing: -0.06em;
	}

	.logo > span {
		display: block;
		color: rgba(255, 255, 255, 0.92);
		text-shadow:
			0.04em 0.06em 0 rgba(0, 0, 0, 0.2),
			0.12em 0.16em 0.32em rgba(0, 0, 0, 0.28);
		transform-origin: center 80%;
	}

	.logo > span:nth-child(1) {
		color: #ff875d;
		transform: translateY(0.06em) rotate(-8deg) skewY(-6deg) scale(1.02, 0.94);
	}

	.logo > span:nth-child(2) {
		color: #ff5c2b;
		transform: translateY(-0.02em) rotate(6deg) skewY(3deg) scale(0.92, 1.08);
	}

	.logo > span:nth-child(3) {
		color: rgba(255, 255, 255, 0.9);
		transform: translateY(0.08em) rotate(-4deg) skewX(-8deg) scale(0.78, 1.16);
	}

	.logo > span:nth-child(4) {
		color: #9c7bff;
		transform: translateY(-0.01em) rotate(7deg) skewY(-5deg) scale(1.04, 0.96);
	}

	.logo > span:nth-child(5) {
		color: #7e5ee2;
		transform: translateY(0.04em) rotate(-6deg) skewX(6deg) scale(0.96, 1.08);
	}

	.logo > span:nth-child(6) {
		color: rgba(255, 255, 255, 0.92);
		transform: translateY(-0.03em) rotate(5deg) skewY(-4deg) scale(0.88, 1.05);
	}

	.logo > span:nth-child(7) {
		color: rgba(255, 255, 255, 0.84);
		transform: translateY(0.05em) rotate(-7deg) skewX(-6deg) scale(1.05, 0.95);
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
