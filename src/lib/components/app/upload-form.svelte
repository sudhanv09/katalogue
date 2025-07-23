<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import CloudUpload from "@lucide/svelte/icons/cloud-upload";

  export let form: any;
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
    <CloudUpload /> Upload</Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Upload File</Dialog.Title>
      <Dialog.Description>
        Upload your epubs to start reading.
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/upload" enctype="multipart/form-data" class="space-y-4">
      {#if form?.error}
        <p class="text-red-500">{form.error}</p>
      {/if}
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <Label for="epub">File</Label>
        <Input id="epub" name="file" type="file" accept=".epub" multiple />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  </Dialog.Content>
</Dialog.Root>
