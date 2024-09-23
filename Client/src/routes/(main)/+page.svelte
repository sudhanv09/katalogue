<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-6 mt-4">
	{#if data.books.length === 0}
		<p class="flex items-center justify-center h-96 font-light text-gray-500">Start Reading</p>
	{/if}
	<div class="grid lg:grid-cols-5 sm:grid-cols-1 md:grid-cols-2">
		{#each data.books as book}
			{#if book.status === 1}
				<BookCard {book} />
			{/if}
		{/each}
	</div>
</div>
