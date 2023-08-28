<script lang="ts">
	import type { PageData } from './$types';
	import BookCard from '$lib/components/BookCard.svelte';

	export let data: PageData;
</script>

<div class="ml-6 ">
	<h1 class="p-4 mt-4 text-3xl font-semibold">{data.books[0].author}</h1>
	<div class="grid grid-cols-5 ">
		{#each data.books as book}
			<BookCard {book} />
		{/each}
	</div>
</div>
