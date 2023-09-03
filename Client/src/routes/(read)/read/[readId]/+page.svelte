<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import {nextChapter} from "$lib/ReadKeybindUtils";
	import {goto} from "$app/navigation";
	import "$src/app.postcss";

	export let data: PageData;
	let scrollContent : HTMLDivElement;

	const url = $page.url.pathname;
	const id = url.split('/').pop();

	async function handleKeyPress(event: KeyboardEvent) {
		switch (event.key){
			case "n":
				const response = await nextChapter(`http://localhost:5050/read/next?id=${id}`);
				return (data.content = response);
			case " ":
				scrollContent.scroll({left: scrollContent.scrollLeft+scrollContent.clientWidth-20, behavior: 'smooth'});
				break;
			case "q":
				goto("/");
			case "h":
				console.log("help");
				
		}
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<svelte:head>
	<link rel="stylesheet" href={`http://localhost:5050/read/book-css?id=${id}`} />
</svelte:head>

<div
	bind:this={scrollContent}
	class="columns-3 col-fill-auto w-full h-screen py-4 overflow-x-scroll"
>
	{@html data.content}
</div>
