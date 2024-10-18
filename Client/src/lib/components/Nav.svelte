<script lang="ts">
	import Button from "../shad/ui/button/button.svelte";
	import { page } from "$app/stores";
	import { cn } from "../utils";
	import { cubicInOut } from "svelte/easing";
	import { crossfade } from "svelte/transition";

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicInOut,
	});
	const className: string | undefined | null = undefined;
	export let items: { href: string; title: string }[];
</script>

<div
	class={cn(
		"flex space-x-2 flex-col lg:space-x-0 lg:space-y-1",
		className,
	)}
>
	{#each items as item}
		{@const isActive = $page.url.pathname === item.href}

		<Button
			href={item.href}
			variant="ghost"
			class={cn(
				!isActive && "hover:underline",
				"relative justify-start hover:bg-transparent",
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
</div>
