<script lang="ts">
  import Button from "$/lib/components/ui/button/button.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<main class="p-24 grid sm:grid-cols-1 lg:grid-cols-2 space-x-36">
  <img src={data.book.cover} alt="" class="sm:h-200px lg:h-400px" />
  <div class="p-4 space-y-6">
    <h1 class="scroll-m-20 text-3xl font-semibold tracking-tight">
      {data.book.title}
    </h1>
    <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">
      {data.book.author}
    </h3>
    <p class="text-muted-foreground text-sm">{data.book.description}</p>

    <p class="text-md">Progress: {data.book.progress}%</p>
    <div>
      <Button href={`/read/${data.book.id}`}>Read</Button>
    </div>
  </div>
</main>
