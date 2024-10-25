<script lang="ts">
  import BookCard from "$src/lib/components/BookCard.svelte";
  let { data } = $props();
</script>

{#if data.booksResult.length === 0}
  <p class="flex items-center justify-center text-neutral-400 h-dvh">
    Books currently being read will be displayed here. Add books to start
    reading!
  </p>
{/if}
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
  {#each data.booksResult as book}
    <BookCard {book} />
  {/each}
</div>
