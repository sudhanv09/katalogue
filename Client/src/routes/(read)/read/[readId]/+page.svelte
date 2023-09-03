<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import '$src/app.postcss';

	export let data: PageData;

	const url = $page.url.pathname;
	const id = url.split('/').pop();

	async function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'n') {
			const req = async () => {
				const getData = await fetch(`http://localhost:5050/read/next?id=${id}`);
				const data = await getData.text();
				return data;
			};

			const response = await req();

			return (data.content = response);
		}
		else if (event.key === ' ') {
			// TODO Implement scrolling
		}
	}
</script>

<svelte:window on:keydown={handleKeyPress} />

<svelte:head>
	<link rel="stylesheet" href={`http://localhost:5050/read/book-css?id=${id}`}>
</svelte:head>

<div id="main-content-body">
	{@html data.content}
</div>
