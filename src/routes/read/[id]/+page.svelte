<script lang="ts">
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<section class="px-4 py-4 columns-2 gap-4 overflow-x-auto overflow-y-hidden h-[calc(100vh-52px)]">
  {@html data.item.chapter.html}
</section>

<style>
  section :global(img) {
    max-width: 100%;
    max-height: 90vh;
    height: auto;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }

  section :global(svg) {
    max-width: 100%;
    max-height: 90vh;
    height: auto;
    display: block;
    margin: 0 auto;
  }

  section :global(div) {
    max-width: 100%;
  }
</style>
