<script lang="ts">
  import type { PageProps } from "./$types";
  import Button from "$/lib/components/ui/button/button.svelte";

  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import TocDrawer from "$/lib/components/app/toc-drawer.svelte";

  import { page } from "$app/state";
  
  let { data }: PageProps = $props();
</script>

<main class="flex flex-col p-2 h-dvh">
  <header class="flex w-full items-center justify-between px-4 py-2">
    <TocDrawer id={page.params.id} toc_data={data.item.toc}/>
    <div class="flex items-center space-x-6">
      <Button>
        <ChevronLeft />
      </Button>
      <h2>{data.item.chapter.title}</h2>
      <Button>
        <ChevronRight />
      </Button>
    </div>
    <div></div>
  </header>
  <section class="grid columns-3 h-full">
    {@html data.item.chapter.html}
  </section>
</main>
