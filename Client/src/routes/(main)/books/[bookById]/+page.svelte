<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	const description =
		data.book.description !== null
			? data.book.description.replace(/<[^>]*>/g, '')
			: 'No description';
</script>

<div class="p-8 mt-8 flex">
	<img
		src={`data:image/jpeg;base64,${data.book.cover}`}
		alt="cover"
		class="w-48 h-128 object-cover"
	/>

	<div class="space-y-8 ml-12">
		<h1 class="text-4xl font-bold">{data.book.title}</h1>
		<h2 class="text-xl font-semibold">{data.book.author}</h2>

		<p>
			{description}
		</p>
		<button class="btn variant-filled"><a href="/read/{data.book.id}">Read</a></button>
		<button class="btn variant-filled mx-4">Edit</button>
	</div>
</div>
