<script lang="ts">
	import KeybindModal from '$src/lib/components/KeybindModal.svelte';
    import { Modal, Drawer } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { initializeStores, getDrawerStore } from '@skeletonlabs/skeleton';
	initializeStores();

	const drawerStore = getDrawerStore();

	const modalComponentRegistry: Record<string, ModalComponent> = {
		keybindModal: {
			ref: KeybindModal
		}
	}

</script>

<Modal components={modalComponentRegistry}/>
<Drawer>
	{#if $drawerStore.id === "toc-drawer"}
		<div class="flex flex-col space-y-4 px-2">
			{$drawerStore.meta.data}
		</div>
	{/if}
</Drawer>
<slot />
