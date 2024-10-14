<script lang="ts">
  import BookCard from "$src/lib/components/BookCard.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

{#if data.books.length === 0}
  <p class="flex items-center justify-center text-neutral-400 h-dvh">
    Books you add will be displayed here.
  </p>
{/if}
<div class="grid sm:grid-cols-1 lg:grid-cols-5 gap-8">
  {#each data.books as book}
    <BookCard {book} />
  {/each}
</div>
