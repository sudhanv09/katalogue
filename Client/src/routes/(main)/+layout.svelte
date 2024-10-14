<script lang="ts">
  import "$src/app.postcss";
  import Nav from "$lib/components/Nav.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import Separator from "$lib/shad/ui/separator/separator.svelte";
  import type { PageData } from "./$types";

  import { Toaster } from "$lib/shad/ui/sonner";

  export let data: PageData;
  const sidebarNavItems = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "To-Read",
      href: "/to-read",
    },
    {
      title: "Finished",
      href: "/finished",
    },
    {
      title: "Authors",
      href: "/authors",
    }
  ];
</script>

<Toaster />

<div
  class="max-h-screen flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-16"
>
  <aside class="lg:w-[300px] mx-6 my-12 space-y-10 text-center">
    <div>
      <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Katalogue
      </h2>
    </div>
    <div>
      <FileUpload />
    </div>
    <div>
      <Nav items={sidebarNavItems} />
      <Separator />
    </div>
    <div class="space-y-6">
      <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">Recent</h3>
      <div class="space-y-3">
        {#each data.recent as item}
          <li class="list-none text-neutral-500">
            <a href={`/book/${item.id}`}>{item.title}</a>
          </li>
        {/each}
      </div>
    </div>
  </aside>
  <div class="lg:h-dvh w-full">
    <slot />
  </div>
</div>
