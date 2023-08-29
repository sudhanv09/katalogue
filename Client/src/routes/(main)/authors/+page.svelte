<script lang="ts">
	import BookCard from '$lib/components/BookCard.svelte';
import type { PageData } from './$types';
	export let data: PageData;

</script>

<div>
	<h1 class="p-4 mt-4 text-3xl font-semibold">Authors</h1>
	<hr class="mt-1" />
	<ul class="p-4 ml-6">
		{#each data.authors as author}
			<li class="my-4">
				<a href="/authors/{author}" class="text-xl">{author}</a>
			</li>
		{/each}
	</ul>
</div>

