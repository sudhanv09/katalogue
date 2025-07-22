<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "@/components/app/app-sidebar.svelte";
  import "../app.css";
  import Navbar from "@/components/app/navbar.svelte";

  let { children } = $props();
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <Navbar />
    <main class="flex h-dvh">
      {@render children()}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
