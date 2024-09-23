<script lang="ts">
	import '$src/app.postcss';
	import SideBar from '$src/lib/components/SideBar.svelte';
    import Separator from "$lib/shad/ui/separator/separator.svelte"

	import { Toaster } from '$src/lib/shad/ui/sonner';

	const sidebarNavItems = [
		{
			title: "Home",
			href: "/",
		},
		{
			title: "Authors",
			href: "/authors",
		},
		{
			title: "Wishlist",
			href: "/reading",
		}
	];
</script>

<Toaster />

<div class="max-h-screen">
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<aside class="lg:w-1/5">
			<SideBar items={sidebarNavItems} />
			<Separator />
			<h3 class="scroll-m-20 text-xl font-semibold tracking-tight">The Joke Tax</h3>
		</aside>
		<!-- <div class="flex-1 lg:max-w-2xl"> -->
			<slot />
		<!-- </div> -->
		 <div>
		 </div>
	</div>
</div>

