<script lang="ts">
	// Styles
	import '$/styles/app.css'
	import '$/styles/fonts.css'


	// Context
	import { page } from '$app/stores'

	let {
		url,
		data,
		data: {
			frame,
			width = 764,
		},
	} = $derived($page)

	let title = $derived.by(() => {
		if (data.title) {
			return data.title
		}

		return (
			url.pathname === '/' ?
				'SKIFFLE'
			: url.pathname === '/about' ?
				'About SKIFFLE'
			: url.pathname === '/farcaster/channels' ?
				'Popular Farcaster channels'
			: url.pathname === '/farcaster/demos/counter' ?
				`Counter demo${typeof data.count === 'number' ? ` · ${data.count}` : ''}`
			: url.pathname === '/farcaster/demos/tips' ?
				`Tip carousel${typeof data.tipIndex === 'number' && typeof data.tipCount === 'number' ? ` · Tip ${data.tipIndex + 1} of ${data.tipCount}` : ''}`
			: url.pathname === '/farcaster/demos/hangman' ?
				'Hangman'
			: url.pathname === '/farcaster/demos/wordle' ?
				'Wordle'
			: url.pathname === '/farcaster/demos/rock-paper-scissors' ?
				'Rock Paper Scissors'
			: url.pathname === '/farcaster/demos/tic-tac-toe' ?
				'Tic-tac-toe'
			: /^\/farcaster\/user\/[^/]+\/casts$/.test(url.pathname) && data.user ?
				`${data.user.display_name} casts`
			: /^\/farcaster\/user\/[^/]+$/.test(url.pathname) && data.user ?
				`${data.user.display_name} (@${data.user.username})`
			:
				undefined
		)
	})

	let aspectRatio = $derived(
		(frame?.image?.aspectRatio ?? '1.91:1')?.split(':').map(Number)
	)

	let height = $derived(
		width * aspectRatio[1] / aspectRatio[0]
	)
	
	let frameImageUrl = $derived.by(() => {
		const _url = new URL(url)
		_url.searchParams.set('frameImage', '')
		return _url.href
	})


	// Props
	const {
		children,
	} = $props()


	// Components
	import FrameMetadata from '$/components/FrameMetadata.svelte'
</script>


<div
	id="root"
	style:width={`${width}px`}
	style:height={`${height}px`}
>
	{@render children()}
</div>


{#if frame}
	<details>
		<summary>Image preview</summary>

		<FrameMetadata
			{title}
			metadata={{
				...frame,
				image: {
					...frame.image,
					url: frameImageUrl,
				},
			}}
			baseUrl={$page.url}
			showPreview={true}
		/>
	</details>
{/if}


<style>
	:global(body) {
		height: 100dvh;
		display: flex;
		flex-wrap: wrap;
		place-content: safe center;
		place-items: center;
		gap: 1em;
	}

	#root {
		display: flex;
		flex-direction: column;
	}
</style>
