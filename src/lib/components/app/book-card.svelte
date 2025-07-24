<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  let { book } = $props();
</script>

<a href={`/books/${book.id}`} class="block">
  <Card.Root class="max-w-xs md:h-[350px] lg:h-[500px] min-w-[200px]">
    <Card.Content class="overflow-hidden">
      <img src={book.cover} alt="" class="w-full h-full object-cover" />
    </Card.Content>
    <Card.Footer class="flex-col">
        <h1 class="scroll-m-20 text-lg font-semibold tracking-tight">
          {book.title}
        </h1>
        <h3 class="text-muted-foreground text-sm">{book.author}</h3>
    </Card.Footer>
  </Card.Root>
</a>
