<script lang="ts">
	// Types/constants
	import type { PageData } from './$types'

	// Props
	let { data }: { data: PageData } = $props()
</script>


<article class="column">
	<header class="column">
		<p class="eyebrow">Abstract art</p>
		<div class="meta row inline">
			<h2>{data.title}</h2>
			<p class="badge">{data.paletteName}</p>
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

	<footer class="column">
		<p class="caption">{data.caption}</p>
		<p class="seed">Seed {data.seed}</p>
	</footer>
</article>


<style>
	article {
		height: 100%;
		min-height: 0;
		gap: 0.85em;
		padding: 0.2em 0.35em 0.35em;
		border-radius: 1.65em;
		overflow: hidden;
		background:
			radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.1), transparent 42%),
			radial-gradient(circle at 92% 8%, rgba(255, 200, 160, 0.08), transparent 36%),
			linear-gradient(165deg, rgba(24, 18, 40, 0.55), rgba(12, 10, 22, 0.35));
	}

	header.column {
		gap: 0.45em;
		flex-shrink: 0;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.72em;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 230, 210, 0.72);
	}

	.meta {
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75em;
		flex-wrap: wrap;
	}

	h2 {
		margin: 0;
		font-size: 1.05em;
		font-weight: 800;
		letter-spacing: -0.02em;
		color: rgba(255, 252, 248, 0.96);
	}

	.badge {
		margin: 0;
		padding: 0.28em 0.65em;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
		font-size: 0.68em;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(255, 236, 220, 0.78);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 0.35em 0.9em rgba(0, 0, 0, 0.18);
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

	footer.column {
		gap: 0.35em;
		flex-shrink: 0;
	}

	.caption {
		margin: 0;
		font-size: 0.82em;
		line-height: 1.45;
		font-weight: 600;
		color: rgba(255, 236, 224, 0.78);
	}

	.seed {
		margin: 0;
		font-size: 0.72em;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 220, 200, 0.52);
	}
</style>
