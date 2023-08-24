<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import SideBar from '$lib/components/SideBar.svelte';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar class="text-3xl ps-6"> 
			<a href="/">Katalogue</a>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft"><SideBar /></svelte:fragment>

	<slot />
</AppShell>



