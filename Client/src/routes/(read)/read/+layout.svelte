<script lang="ts">
	import '../../../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<AppShell>
	<svelte:fragment slot="header"><a href="/">Home</a></svelte:fragment>

	<div class="sm:columns-1 lg:columns-3 p-6 h-screen w-full overflow-x-auto">
		<slot />
	</div>

	<svelte:fragment slot="footer">Footer</svelte:fragment>
</AppShell>
