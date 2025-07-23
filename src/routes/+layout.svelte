<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "@/components/app/app-sidebar.svelte";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import "../app.css";

  let { children } = $props();
</script>

<Toaster />

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    {@render children()}
  </Sidebar.Inset>
</Sidebar.Provider>
