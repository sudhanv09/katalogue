<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  let { book } = $props();
</script>

<a href={`/books/${book.id}`} class="block">
  <Card.Root class="w-full h-full max-w-xs min-w-[200px]">
    <Card.Content class="overflow-hidden">
      <img src={book.cover} alt="" class="w-full h-full object-cover" />
    </Card.Content>
    <Card.Footer class="flex-col gap-2 p-4">
      <div class="">
        <h1 class="scroll-m-20 text-lg font-semibold tracking-tight">
          {book.title}
        </h1>
        <h3 class="text-muted-foreground text-sm">{book.author}</h3>
      </div>
    </Card.Footer>
  </Card.Root>
</a>
