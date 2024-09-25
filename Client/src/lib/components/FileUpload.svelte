<script lang="ts">
  import { Button, buttonVariants } from "$lib/shad/ui/button";
  import * as Dialog from "$lib/shad/ui/dialog";
  import { Input } from "$lib/shad/ui/input";
  import { Label } from "$lib/shad/ui/label";
  import { Plus } from "lucide-svelte";
  import { handleFileUpload } from "../FileUpload";
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "default" })}
    ><Plus class="w-4 h-4 mx-2" />Add</Dialog.Trigger
  >
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Upload files</Dialog.Title>
      <Dialog.Description>Add your ebooks.</Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-right">File</Label>
        <Input id="name" type="file" accept=".epub" class="col-span-3 text-neutral-400" />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit" on:click={handleFileUpload}>Upload</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
