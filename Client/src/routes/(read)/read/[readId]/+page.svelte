<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	async function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'n') {
			const req = async () => {
				const params = window.location.href.split('/');
				const url = params[params.length - 1];

				const getData = await fetch(`http://localhost:5050/read/next?id=${url}`);
				const data = await getData.text();
				return data;
			};

			const response = await req();

			return (data.content = response);
		}
	}
</script>

<!-- TODO Implement scrolling with spacebar
    TODO Implement scroll restore
-->
<svelte:window on:keydown={handleKeyPress} />

<div id="main-content-body" data-sveltekit-noscroll>
	{@html data.content}
</div>

<!-- <style>
	{data.css}
</style> -->