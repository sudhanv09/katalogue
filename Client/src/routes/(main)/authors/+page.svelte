<script lang="ts">
  let { data } = $props();
</script>

{#if data.authorResult.length === 0}
  <p class="flex items-center justify-center text-neutral-400 h-dvh">
    No books added yet
  </p>
{/if}
<div>
  <h1 class="p-4 mt-4 text-3xl font-semibold">Authors</h1>
  <hr class="mt-1" />
  <ul class="p-4 ml-6">
    {#each data.authorResult as author}
      <li class="my-4">
        <a href="/authors/{author}" class="text-xl">{author}</a>
      </li>
    {/each}
  </ul>
</div>
