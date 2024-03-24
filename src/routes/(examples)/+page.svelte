<article class="card column">
	<h1><span class="svelte">SK</span>I<span class="farcaster">FF</span>LE</h1>

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
		padding: 2.25em;
		border-radius: 1em;
		background: radial-gradient(circle, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.075));
		gap: 1.5em;

		text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.15), 0 0 10px rgba(0, 0, 0, 0.25);
	}

	h1 {
		-webkit-background-clip: text;
		background-clip: text;
		color: rgba(255, 255, 255, 0.25);
		/* background-image: linear-gradient(to right, #ff3e00, #8a63d2); */
		font-size: 3.75em;
		font-weight: 900;
		letter-spacing: 0.1em;
		line-height: 1;
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
