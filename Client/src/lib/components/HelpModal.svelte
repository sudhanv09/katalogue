<script lang="ts">
    import * as Dialog from "$src/lib/shad/ui/dialog";

    export let modalOpen: boolean;
</script>

<Dialog.Root open={modalOpen}>
    <Dialog.Trigger />
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Keyboard Shortcuts</Dialog.Title>
      </Dialog.Header>
      <div class="card h-fit flex flex-col items-center justify-center p-8">
        <h2 class="text-xl font-bold">Quick Shortcuts</h2>
        <ul class="space-y-4 mt-4">
          <li>
            <p><kbd>n</kbd>: Next chapter</p>
          </li>
          <li>
            <p><kbd>p</kbd>: Previous chapter</p>
          </li>
          <li>
            <p><kbd>Space</kbd>: Scroll page</p>
          </li>
          <li>
            <p><kbd>q</kbd>: Quit to menu</p>
          </li>
          <li>
            <p><kbd>h</kbd>: Help</p>
          </li>
        </ul>
      </div>
    </Dialog.Content>
  </Dialog.Root>