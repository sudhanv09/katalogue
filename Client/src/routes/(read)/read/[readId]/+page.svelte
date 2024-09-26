<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import "$src/app.postcss";


  export let data: PageData;
  let scrollContent: HTMLDivElement;

  const url = $page.url.pathname;
  const id = url.split("/").pop();

  async function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case "n":
        const response = await fetch(
          `http://localhost:5050/read/next?id=${id}`
        );
        return (data.content = await response.text());
      case " ":
        scrollContent.scroll({
          left: scrollContent.scrollLeft + scrollContent.clientWidth + 70,
          behavior: "smooth",
        });
        break;
      case "q":
        goto("/");
        break;
    }
  }
</script>

<svelte:window on:keydown={handleKeyPress} />

<svelte:head>
  <link
    rel="stylesheet"
    href={`http://localhost:5050/read/book-css?id=${id}`}
  />
</svelte:head>

<div
  bind:this={scrollContent}
  class="columns-2 gap-12 py-6 h-dvh overflow-x-scroll"
>
<div class="p-8">
  {@html data.content}
</div>
</div>
