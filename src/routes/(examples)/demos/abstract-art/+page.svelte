<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Props
	let { data }: { data: PageData } = $props()
</script>


<article class="column">
	<header>
		<div class="meta row inline">
			<div class="title column">
				<p class="eyebrow">Generative Art</p>
				<h2>"{data.title}"</h2>
			</div>
			<div class="badges row inline">
				<p class="badge badge-palette">{data.paletteColor}</p>
				<p class="badge">#{data.seed}</p>
			</div>
		</div>
	</header>

	<section
		class="stage"
		aria-label="Generated abstract composition"
		style={data.sceneStyle}
	>
		{#each data.shapes as shape (shape.id)}
			<div
				class="mark"
				style={shape.style}
				aria-hidden="true"
			></div>
		{/each}
		<div
			class="veil"
			style={data.veilStyle}
			aria-hidden="true"
		></div>
	</section>

</article>


<style>
	article {
		height: 100%;
		min-height: 0;
		gap: 1.15em;
		padding: 0.45em 0.55em 0.55em;
		border-radius: 1.65em;
		overflow: hidden;
		background:
			radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.1), transparent 42%),
			radial-gradient(circle at 92% 8%, rgba(255, 200, 160, 0.08), transparent 36%),
			linear-gradient(165deg, rgba(24, 18, 40, 0.55), rgba(12, 10, 22, 0.35));
	}

	header {
		padding: 0.3em 0.18em 0;
		flex-shrink: 0;
	}

	.meta {
		align-items: flex-start;
		justify-content: space-between;
		gap: 1em;
		width: 100%;
	}

	.title {
		gap: 0.35em;
		flex: 1;
		min-width: 0;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.68em;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 226, 204, 0.58);
	}

	h2 {
		margin: 0;
		font-size: 1.34em;
		font-weight: 800;
		line-height: 1.04;
		letter-spacing: -0.03em;
		text-align: left;
		color: rgba(255, 252, 248, 0.96);
	}

	.badges {
		align-items: flex-start;
		justify-content: flex-end;
		gap: 0.45em;
		flex-shrink: 0;
		padding-top: 0.08em;
	}

	.badge {
		margin: 0;
		flex-shrink: 0;
		padding: 0.28em 0.65em;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
		font-size: 0.68em;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: none;
		color: rgba(255, 236, 220, 0.78);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 0.35em 0.9em rgba(0, 0, 0, 0.18);
	}

	.badge-palette {
		text-transform: capitalize;
		color: rgba(255, 244, 236, 0.88);
		background: linear-gradient(135deg, rgba(255, 184, 126, 0.18), rgba(255, 255, 255, 0.06));
	}

	.stage {
		position: relative;
		flex: 1;
		min-height: 0;
		width: 100%;
		align-self: center;
		border-radius: 1.35em;
		overflow: hidden;
		box-sizing: border-box;
		margin: 0.2em 0 0;
	}

	.stage > .mark {
		position: absolute;
		box-sizing: border-box;
	}

	.veil {
		position: absolute;
		inset: 0;
		box-sizing: border-box;
		pointer-events: none;
	}

</style>
