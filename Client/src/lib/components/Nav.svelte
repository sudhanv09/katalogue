<script lang="ts" module>
	const data = {
		navMain: [
			{
				title: "Library",
				items: [
					{
						title: "Home",
						url: "/",
						isActive: true,
					},
					{
						title: "To-Read",
						url: "/to-read",
					},
					{
						title: "Finished",
						url: "/finished",
					},
					{
						title: "Authors",
						url: "/author",
					},
				],
			},
		],
	};
</script>

<script lang="ts">
	import * as Sidebar from "$lib/shad/ui/sidebar";
	import type { ComponentProps } from "svelte";
  import SearchForm from "./SearchForm.svelte";

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
	
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header class="m-4 ">
		<h1 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-center">Katalogue</h1>
		<SearchForm />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				{#each data.navMain as groupItem (groupItem.title)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton class="text-sm text-neutral-400">
							{#snippet child({ props })}
								<h1 {...props}>
									{groupItem.title}
								</h1>
							{/snippet}
						</Sidebar.MenuButton>
						{#if groupItem.items?.length}
							<Sidebar.MenuSub>
								{#each groupItem.items as item (item.title)}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton isActive={item.isActive}>
											{#snippet child({ props })}
												<a href={item.url} {...props}>{item.title}</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						{/if}
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>