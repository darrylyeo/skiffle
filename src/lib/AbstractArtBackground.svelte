<script lang="ts">
	// Types/constants
	type AbstractArtBackgroundView = {
		backgroundStyle: string
		veilStyle: string
		shapes: {
			id: string
			style: string
		}[]
	}

	// Props
	let {
		background,
		inset = '-8%',
		opacity = 0.28,
	}: {
		background: AbstractArtBackgroundView
		inset?: string
		opacity?: number
	} = $props()
</script>


<div
	class="root"
	style="{background.backgroundStyle} inset:{inset}; opacity:{opacity};"
	aria-hidden="true"
>
	{#each background.shapes as shape (shape.id)}
		<div class="mark" style={shape.style}></div>
	{/each}

	<div class="veil" style={background.veilStyle}></div>
</div>


<style>
	.root {
		position: absolute;
		overflow: hidden;
		pointer-events: none;
	}

	.mark,
	.veil {
		position: absolute;
		box-sizing: border-box;
	}

	.veil {
		inset: 0;
	}
</style>
