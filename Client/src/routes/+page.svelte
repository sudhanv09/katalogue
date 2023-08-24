<script lang="ts">
	import type { PageData } from "./$types";
    
    export let data: PageData;

</script>

{#each data.books as book}
    <h1>{book.author}</h1>
    <h1>{book.title}</h1>
    <h1>{book.status}</h1>
    <img src="{`data:image/jpeg;base64,${book.cover}`}" alt="cover" width="150" height="150">
{/each}

