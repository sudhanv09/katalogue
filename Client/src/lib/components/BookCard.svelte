<script lang="ts">
	import type { Book } from '$lib/types';
	export let book: Book;
</script>

<div class="w-64 mx-6 card card-hover p-4 mt-6 flex flex-col items-center justify-center">
	<a href="/books/{book.id}">
		<header>
			<img
				src={`data:image/jpeg;base64,${book.cover}`}
				alt="cover"
				class="w-full h-64 object-cover"
			/>
		</header>
		<footer class="mt-4">
			<h2 class="font-bold">{book.title}</h2>
			<p>{book.author}</p>
		</footer>
	</a>
</div>
