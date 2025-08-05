<script lang="ts">
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<section class="p-16 h-full">
  {@html data.item.chapter.html}
</section>
