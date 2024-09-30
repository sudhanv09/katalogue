<script lang="ts">
  import "$src/app.postcss";
  import SideBar from "$src/lib/components/SideBar.svelte";
  import Separator from "$lib/shad/ui/separator/separator.svelte";
  import FileUpload from "$src/lib/components/FileUpload.svelte";

  import { Toaster } from "$src/lib/shad/ui/sonner";

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
    {
      title: "Wishlist",
      href: "/reading",
    }
  ];
</script>

<Toaster />

<div
  class="max-h-screen flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-16"
>
  <aside class="lg:w-[300px] mx-6 my-12 space-y-10">
    <div>
      <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Katalogue
      </h2>
    </div>
    <FileUpload />
    <div>
      <SideBar items={sidebarNavItems} />
      <Separator />
    </div>
    <div>
      <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">Recent</h3>
    </div>
  </aside>
  <div class="lg:w-full">
    <slot />
  </div>
</div>
