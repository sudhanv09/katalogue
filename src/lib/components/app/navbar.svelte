<script>
  import Input from "../ui/input/input.svelte";
  import Separator from "../ui/separator/separator.svelte";
  import { SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
  import Button from "../ui/button/button.svelte";
  import Search from "@lucide/svelte/icons/search";

  let search_text = $state("");
</script>

<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
  <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
    <SidebarTrigger class="-ml-1" />
    <Separator
      orientation="vertical"
      class="mx-2 data-[orientation=vertical]:h-4"
    />
    <h1 class="text-base font-medium">Home</h1>
  </div>
  <div class="flex space-x-4">
    <div class="flex items-center gap-1">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2"
      />
      <Input
        type="text"
        placeholder="Search"
        bind:value={search_text}
        class="peer block w-full rounded-md border py-[9px] pl-10 text-sm"
      />
    </div>
    <Button>Upload</Button>
  </div>
</header>
