<script lang="ts">
	// Props
	const {
		title,
		src,
		alt = 'Page preview',
	}: {
		title?: string,
		src: string,
		alt?: string,
	} = $props()
</script>


<div class="page-image">
	{title}

	<img {src} {alt} />
</div>


<style>
	.page-image {
		display: grid;
	}
</style>
