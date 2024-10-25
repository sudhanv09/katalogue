<script lang="ts">
  import BookCard from "$src/lib/components/BookCard.svelte";
  let { data } = $props();
</script>

{#if data.booksResult.length === 0}
  <p class="flex items-center justify-center text-neutral-400 h-dvh">
    Books you have finished reading will be displayed here.
  </p>
{/if}
<div class="grid grid-cols-4 gap-4">
  {#each data.booksResult as book}
    <BookCard {book} />
  {/each}
</div>
