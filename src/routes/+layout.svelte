<script lang="ts">
	const {
		children,
	} = $props()
</script>


<main
	style:width={400}
	style:height={400}
>
	{@render children()}
</main>


<style>
	main {
		font-family: Ubuntu;
		padding: 1em;
	}
</style>
