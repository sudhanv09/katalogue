<script lang="ts">
    import Button from "../shad/ui/button/button.svelte";
    import { page } from "$app/stores";
    import { cn } from "../utils";
    import { cubicInOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";
	import Separator from "$lib/shad/ui/separator/separator.svelte";
	import FileUpload from "$src/lib/components/FileUpload.svelte";
    
    const [send, receive] = crossfade({
        duration: 250,
		easing: cubicInOut,
	});
    const className: string | undefined | null = undefined;
    export let items: { href: string; title: string }[];
</script>

<aside class="lg:w-[300px] mx-6 my-12 space-y-10">
    <div>
      <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Katalogue
      </h2>
    </div>
    <div>
      <FileUpload />
    </div>
    <div>
		<nav class={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}>
			{#each items as item}
				{@const isActive = $page.url.pathname === item.href}
		
				<Button
					href={item.href}
					variant="ghost"
					class={cn(
						!isActive && "hover:underline",
						"relative justify-start hover:bg-transparent"
					)}
					data-sveltekit-noscroll
				>
					{#if isActive}
						<div
							class="bg-muted absolute inset-0 rounded-md"
							in:send={{ key: "active-sidebar-tab" }}
							out:receive={{ key: "active-sidebar-tab" }}
						/>
					{/if}
					<div class="relative">
						{item.title}
					</div>
				</Button>
			{/each}
		</nav>
      <Separator />
    </div>
    <div>
      <h3 class="scroll-m-20 text-xl font-semibold tracking-tight">Recent</h3>
    </div>
  </aside>

