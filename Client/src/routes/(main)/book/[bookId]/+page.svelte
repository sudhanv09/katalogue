<script lang="ts">
  import type { PageData } from "./$types";
  import Button from "$src/lib/shad/ui/button/button.svelte";
  import { Play, Pencil, Trash } from "lucide-svelte";
  import DeleteModal from "$src/lib/components/DeleteModal.svelte";
  export let data: PageData;

  const description =
    data.book.description !== null
      ? data.book.description.replace(/<[^>]*>/g, "")
      : "No description";
</script>

<div class="p-4 mt-8 flex lg:flex-row">
  <div class="basis-1/4">
    <img
      src={`data:image/jpeg;base64,${data.book.cover}`}
      alt="cover"
      class="max-w-96 max-h-96 h-full w-full"
    />
  </div>

  <div class="space-y-8 basis-3/4">
    <div class="space-y-4">
      <h1
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        {data.book.title}
      </h1>
      <h2 class="text-xl font-semibold">{data.book.author}</h2>
    </div>

    <p class="leading-7 [&:not(:first-child)]:mt-6">
      {description}
    </p>

    <div class="flex space-x-5">
      <Button href="/read/{data.book.id}" class="inline-flex items-center">
        <Play class="w-4 h-4 mr-3" />
        Read
      </Button>
      <Button>
        <Pencil class="w-4 h-4 mr-3" />
        Edit
      </Button>
      <DeleteModal />
    </div>
  </div>
</div>
