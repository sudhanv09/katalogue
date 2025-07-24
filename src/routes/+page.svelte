<script lang="ts">
  import Navbar from "@/components/app/navbar.svelte";
  import type { PageProps } from "./$types";
  import BookCard from "@/components/app/book-card.svelte";

  let { data }: PageProps = $props();
</script>

<main class="h-dvh w-full">
  <Navbar />

  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4"
  >
    {#each data.books as book}
      <BookCard {book} />
    {/each}
  </div>
</main>
