<script>
    import Input from "../ui/input/input.svelte";
    import Separator from "../ui/separator/separator.svelte";
    import { SidebarTrigger } from "$lib/components/ui/sidebar/index.js";
    import UploadForm from "./upload-form.svelte";
    import { searchTerm, updateSearchTerm } from "$lib/stores/search.js";
    import SunIcon from "@lucide/svelte/icons/sun";
    import MoonIcon from "@lucide/svelte/icons/moon";

    import { toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button/index.js";

    let form = $props();
</script>

<header
    class="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4 w-full"
>
    <div class="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger class="-ml-1" />
        <Separator
            orientation="vertical"
            class="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 class="text-base font-medium">Home</h1>
    </div>
    <div class="flex space-x-4">
        <Input
            type="text"
            placeholder="Search"
            bind:value={$searchTerm}
            oninput={(e) => updateSearchTerm(e.currentTarget.value)}
            class="peer block w-full rounded-md border py-2.25 pl-10 text-sm"
        />
        <UploadForm {form} />
        <Button onclick={toggleMode} variant="outline" size="icon">
          <SunIcon
            class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90"
          />
          <MoonIcon
            class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
    </div>
</header>
