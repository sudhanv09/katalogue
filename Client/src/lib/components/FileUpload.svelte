<script lang="ts">
  import { Button, buttonVariants } from "$lib/shad/ui/button";
  import * as Dialog from "$lib/shad/ui/dialog";
  import Input from "../shad/ui/input/input.svelte";
  import { Label } from "$lib/shad/ui/label";
  import { Plus } from "lucide-svelte";
  import { handleFileUpload } from "../FileUpload";

  let files: FileList | null;
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
        <Label for="bookUpload" class="text-right">File</Label>
        <input
          accept=".epub"
          bind:files
          id="file"
          name="bookUpload"
          class="col-span-3 text-neutral-400 border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          type="file"
          multiple
        />
      </div>
      <Dialog.Footer>
        <Button type="submit" on:click={() => handleFileUpload(files)}>Upload</Button>
      </Dialog.Footer>
    </div>
  </Dialog.Content>
</Dialog.Root>
