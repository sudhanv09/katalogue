<script lang="ts">
	import '$src/app.postcss';
	import { AppShell, AppBar, Toast } from '@skeletonlabs/skeleton';
	import SideBar from '$lib/components/SideBar.svelte';

	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();
</script>

<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar class="text-3xl ps-6">
			<a href="/">Katalogue</a>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft"><SideBar /></svelte:fragment>

	<slot />
</AppShell>
