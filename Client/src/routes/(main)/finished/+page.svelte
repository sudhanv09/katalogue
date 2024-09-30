<script lang="ts">
    import BookCard from "$src/lib/components/BookCard.svelte";
    import type { PageData } from "./$types";
  
    export let data: PageData;
  </script>
  
  <div class="grid grid-cols-4 gap-4">
    {#each data.books as book}
      <BookCard {book} />
    {/each}
  </div>
  