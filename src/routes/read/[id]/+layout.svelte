<script lang="ts">
  import Button from "$/lib/components/ui/button/button.svelte";

  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import TocDrawer from "$/lib/components/app/toc-drawer.svelte";

  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  let { children } = $props();

  const getChpIndex = (
    toc: { id: string; title: string; href: string }[],
    currentId: string | undefined
  ) => {
    return toc.findIndex((item) => item.id === currentId);
  };

  const navChp = (direction: "prev" | "next") => {
    const { params, data } = page;
    const toc: { id: string; title: string; href: string }[] = data.item.toc;
    console.log(toc);
    const index = getChpIndex(toc, params.id);

    if (index === -1) return;

    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    const target = toc[targetIndex];
    console.log(target);

    if (target) {
      const newUrl = `?id=${target.id}`;
      goto(newUrl);
    }
  };
</script>

<header class="flex w-full items-center justify-between px-4 py-2">
  <TocDrawer id={page.params.id} toc_data={page.data.item.toc} />
  <div class="flex items-center space-x-6">
    <Button onclick={() => navChp("prev")}>
      <ChevronLeft />
    </Button>
    <h2>{page.data.item.chapter.title}</h2>
    <Button onclick={() => navChp("next")}>
      <ChevronRight />
    </Button>
  </div>
  <div></div>
</header>

{@render children()}
