<script lang="ts">
  import "$src/app.postcss";
  import SideBar from "$src/lib/components/SideBar.svelte";


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
  <div>
    <SideBar items={sidebarNavItems}/>
  </div>
  <div class="lg:h-dvh w-full">
    <slot />
  </div>
</div>
