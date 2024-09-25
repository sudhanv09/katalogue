<script lang="ts">
  import BookCard from "$src/lib/components/BookCard.svelte";
  import FileUpload from "$src/lib/components/FileUpload.svelte";
  import * as ToggleGroup from "$lib/shad/ui/toggle-group";
  import Button from "$src/lib/shad/ui/button/button.svelte";
  import { Pencil } from "lucide-svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div class="space-y-10">
  <div class="flex justify-between mx-16">
    <ToggleGroup.Root type="single">
      <ToggleGroup.Item value="bold" aria-label="Toggle bold">
        <h4 class="scroll-m-20 text-lg font-medium tracking-wide ">Reading</h4>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic" aria-label="Toggle italic">
        <h4 class="scroll-m-20 text-lg font-medium tracking-wide">To Read</h4>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
        <h4 class="scroll-m-20 text-lg font-medium tracking-wide">Finished</h4>
      </ToggleGroup.Item>
    </ToggleGroup.Root>
    <div class="space-x-4">
      <FileUpload />
      <Button>
        <Pencil class="w-4 h-4 mx-2" />Edit
      </Button>
    </div>
  </div>

  <div class="grid grid-cols-4 gap-4">
    {#each data.books as book}
      <BookCard {book}/>
    {/each}
  </div>

</div>
