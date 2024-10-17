<script lang="ts">
  import "$src/app.postcss";
  import Nav from "$lib/components/Nav.svelte";
  import FileUpload from "$lib/components/FileUpload.svelte";
  import Separator from "$lib/shad/ui/separator/separator.svelte";

  import { Toaster } from "$lib/shad/ui/sonner";
  import type { PageData } from "./$types";
  import * as Sheet from "$src/lib/shad/ui/sheet";
  import Button from "$src/lib/shad/ui/button/button.svelte";
  import { Menu, Search } from "lucide-svelte";

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
    },
  ];
</script>

<Toaster />

<header
  class="min-h-screen flex flex-col lg:flex-row lg:space-x-12 lg:space-y-16"
>
  <nav class="hidden md:block space-y-10 lg:w-[300px] mx-6 my-12 text-center">
    <h2
      class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      Katalogue
    </h2>
    <FileUpload />
    <Nav items={sidebarNavItems} />
    <Separator />

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
  </nav>
  <Sheet.Root>
    <Sheet.Trigger asChild let:builder>
      <Button
        variant="outline"
        size="icon"
        class="shrink-0 md:hidden mt-4"
        builders={[builder]}
      >
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left" class="flex flex-col">
      <nav class="space-y-10 lg:w-[300px] mx-6 my-12 text-center">
        <h2
          class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
        >
          Katalogue
        </h2>
        <FileUpload />
        <Nav items={sidebarNavItems} />
        <Separator />

        <div class="space-y-6">
          <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">
            Recent
          </h3>
          <div class="space-y-3">
            {#each data.recent as item}
              <li class="list-none text-neutral-500">
                <a href={`/book/${item.id}`}>{item.title}</a>
              </li>
            {/each}
          </div>
        </div>
      </nav>
    </Sheet.Content>
  </Sheet.Root>
  <div class="lg:h-dvh w-full">
    <slot />
  </div>
</header>
