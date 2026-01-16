<script lang="ts">
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<section class="p-16 h-full">
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
