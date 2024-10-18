<script lang="ts">
  import BookCard from "$src/lib/components/BookCard.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

{#if data.books.length === 0}
  <p class="flex items-center justify-center text-neutral-400 h-dvh">
    Books currently being read will be displayed here. Add books to start
    reading!
  </p>
{/if}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
  {#each data.books as book}
    <BookCard {book} />
  {/each}
</div>
