<script lang="ts">
	import '$src/app.postcss';
	import SideBar from '$lib/components/SideBar.svelte';

	import { Toaster } from '$src/lib/shad/ui/sonner';
</script>

<Toaster />

<div>
	<a href="/">Katalogue</a>
	<SideBar />

	<slot />
</div>
