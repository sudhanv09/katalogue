<script lang="ts">
  import BookCard from "$src/lib/components/BookCard.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

{#if data.books.length === 0}
  <p class="flex items-center justify-center text-neutral-400 h-dvh">
    Books you have finished reading will be displayed here.
  </p>
{/if}
<div class="grid grid-cols-4 gap-4">
  {#each data.books as book}
    <BookCard {book} />
  {/each}
</div>
