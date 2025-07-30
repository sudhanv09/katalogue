<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  
</script>

{@html data.item.chapter.html}