<script lang="ts">
	// Props
	const {
		data,
	} = $props()
</script>


<div class="column">
	<header class="row">
		<div class="row">
			<img src={data.user.pfp_url} />

			<div id="name" class="row">
				<h1>{data.user.display_name}</h1>

				<span>@{data.user.username}</span>
			</div>
		</div>

		<div class="annotation">
			#{data.user.fid}
		</div>
	</header>

	<p>{data.user.bio}</p>
</div>


<style>
	#name {
		gap: 0.75em;
	}

	img {
		width: 2.5em;
		height: 2.5em;
	}

	.annotation {
		opacity: 0.75;
	}
</style>
