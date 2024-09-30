<script lang="ts">
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import * as Dialog from "$src/lib/shad/ui/dialog";
  import "$src/app.postcss";

  export let data: PageData;
  console.log(data.content);
  let scrollContent: HTMLDivElement;
  let modalOpen = false;

  const url = $page.url.pathname;
  const id = url.split("/").pop();

  async function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case "n":
        const next = await fetch(`http://localhost:5050/read/next?id=${id}`);
        return (data.content = await next.text());
      case "p":
        const prev = await fetch(`http://localhost:5050/read/prev?id=${id}`);
        return (data.content = await prev.text());
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

<svelte:window on:keydown={handleKeyPress} />

<svelte:head>
  <link
    rel="stylesheet"
    href={`http://localhost:5050/read/book-css?id=${id}`}
  />
</svelte:head>

<Dialog.Root open={modalOpen}>
  <Dialog.Trigger />
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Keyboard Shortcuts</Dialog.Title>
    </Dialog.Header>
    <div class="card h-fit flex flex-col items-center justify-center p-8">
      <h2 class="text-xl font-bold">Quick Shortcuts</h2>
      <ul class="space-y-4 mt-4">
        <li>
          <p><kbd>n</kbd>: Next chapter</p>
        </li>
        <li>
          <p><kbd>p</kbd>: Previous chapter</p>
        </li>
        <li>
          <p><kbd>Space</kbd>: Scroll page</p>
        </li>
        <li>
          <p><kbd>q</kbd>: Quit to menu</p>
        </li>
        <li>
          <p><kbd>h</kbd>: Help</p>
        </li>
      </ul>
    </div>
  </Dialog.Content>
</Dialog.Root>

<div
  bind:this={scrollContent}
  class="columns-2 gap-12 py-6 h-dvh overflow-x-scroll"
>
  <div class="p-8">
    {@html data.content}
  </div>
</div>
