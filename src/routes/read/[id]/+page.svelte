<script lang="ts">
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<section class="grid columns-3 h-full">
  {@html data.item.chapter.html}
</section>
