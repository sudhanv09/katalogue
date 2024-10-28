<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import HelpModal from "$src/lib/components/HelpModal.svelte";

  let { data } = $props();
  let scrollContent: HTMLDivElement;
  let modalOpen = $state(false);

  const url = $page.url.pathname;
  const id = url.split("/").pop();

  async function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case "n": {
        scrollContent.scroll({
          left: 0,
          behavior: "smooth",
        });
        const next = await fetch(`http://localhost:5050/read/next?id=${id}`);
        data.content = await next.text();
        return data;
      }
      case "p": {
        const prev = await fetch(`http://localhost:5050/read/prev?id=${id}`);
        data.content = await prev.text();
        return data;
      }
      case " ":
        scrollContent.scroll({
          left: scrollContent.scrollLeft + scrollContent.clientWidth + 70,
          behavior: "smooth",
        });
        break;
      case "q":
        goto("/");
        break;
      case "h":
        modalOpen = !modalOpen;
        break;
    }
  }
</script>

<svelte:window onkeydown={handleKeyPress} />
<HelpModal {modalOpen} />
<svelte:head>
  <link
    rel="stylesheet"
    href={`http://localhost:5050/read/book-css?id=${id}`}
  />
</svelte:head>

<div
  bind:this={scrollContent}
  class="columns-2 gap-12 py-6 h-[calc(100dvh-72px)] overflow-x-scroll"
>
  <div class="p-8">
    {@html data.content}
  </div>
</div>
