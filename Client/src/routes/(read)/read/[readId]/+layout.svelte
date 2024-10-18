<script lang="ts">
    import type { LayoutData } from "./$types";
    import Button from "$src/lib/shad/ui/button/button.svelte";
    import { ArrowLeft, ArrowRight } from "lucide-svelte";
    import { page } from "$app/stores";

    export let data: LayoutData;
    const url = $page.url.pathname;
    const id = url.split("/").pop();

    const nextChp = async () => {
        const next = await fetch(`http://localhost:5050/read/next?id=${id}`);
        data.content = await next.text();
        return data;
    };

    const prevChp = async () => {
        const prev = await fetch(`http://localhost:5050/read/prev?id=${id}`);
        data.content = await prev.text();
        return data;
    };
</script>

<header class="top-0 flex justify-center items-center space-x-8 h-12">
    <Button variant="ghost" on:click={nextChp}>
        <ArrowLeft class="h-4 w-4"></ArrowLeft>
    </Button>
    <h1 class="font-bold">{data.info.title}</h1>
    <Button variant="ghost" on:click={prevChp}>
        <ArrowRight class="h-4 w-4"></ArrowRight>
    </Button>
</header>
<div>
    <slot />
</div>
