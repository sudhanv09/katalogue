<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { handleFileUpload } from '$lib/FileUpload';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-6 mt-4">
	<div class="flex justify-between">
		<h1 class="text-2xl font-bold">Library</h1>
		<div class="w-full flex justify-end">
			<FileButton
				name="files"
				button="btn variant-filled"
				on:change={handleFileUpload}
				multiple
				accept=".epub"
			>
				Add</FileButton
			>
		</div>
	</div>
	<hr class="mt-2" />
	{#if data.books.length === 0}
		<p class="flex items-center justify-center h-screen font-light">Add books to start reading!</p>
	{:else}
		<div class="grid grid-cols-5">
			{#each data.books as book}
				<BookCard {book} />
			{/each}
		</div>
	{/if}
</div>
