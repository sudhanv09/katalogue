<script lang="ts">
  import "$src/app.postcss";
  import Nav from "$lib/components/Nav.svelte";
  import { Toaster } from "$lib/shad/ui/sonner";
  import * as Sidebar from "$src/lib/shad/ui/sidebar";

  let { data, children } = $props();
</script>

<Toaster />
<Sidebar.Provider>
  <Nav />
  <Sidebar.Inset>
    <Sidebar.Trigger />
    {@render children()}
  </Sidebar.Inset>
</Sidebar.Provider>
