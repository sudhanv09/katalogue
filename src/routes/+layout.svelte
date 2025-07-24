<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "@/components/app/app-sidebar.svelte";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import "../app.css";
  import type { LayoutProps } from "./$types";

  let { children, data }: LayoutProps = $props();
</script>

<Toaster richColors />

<Sidebar.Provider>
  <AppSidebar authors={data.authors}/>
  <Sidebar.Inset>
    {@render children()}
  </Sidebar.Inset>
</Sidebar.Provider>
