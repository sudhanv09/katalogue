<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import Menu from "@lucide/svelte/icons/menu";

  let {
    id,
    toc_data,
  }: { id: string|undefined; toc_data: { id: string; title: string; href: string }[] } =
    $props();
</script>

<Drawer.Root>
  <Drawer.Trigger><Menu /></Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Table of Contents</Drawer.Title>
    </Drawer.Header>
    <div class="flex flex-col space-y-4">
      {#each toc_data as item}
        <a href={`/api/book/${id}/resource/${item.href}`}>{item.href}</a>
      {/each}
    </div>
  </Drawer.Content>
</Drawer.Root>
