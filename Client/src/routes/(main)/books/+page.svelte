<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-6 mt-4">
	<h1 class="text-2xl font-bold">Library</h1>
	<hr class="mt-2" />
	<div class="grid grid-cols-5">
		{#each data.books as book}
				<BookCard {book} />
		{/each}
	</div>
</div>