<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';

	let { data } = $props();
</script>

<div class="ml-6 ">
	<h1 class="p-4 mt-4 text-3xl font-semibold">{data.data[0].author}</h1>
	<div class="grid grid-cols-5 ">
		{#each data.data as book}
			<BookCard {book} />
		{/each}
	</div>
</div>
