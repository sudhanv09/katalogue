<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import CloudUpload from "@lucide/svelte/icons/cloud-upload";
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
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label for="epub">File</Label>
      <Input id="epub" type="file" accept=".epub" multiple/>
    </div>
    <Dialog.Footer>
      <Button type="submit">Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
