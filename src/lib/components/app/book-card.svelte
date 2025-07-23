<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  let { book } = $props();
</script>

<a href={`/books/${book.id}`}>
  <Card.Root class="w-full max-w-sm">
    <Card.Content>
      <img src="" alt="" />
    </Card.Content>
    <Card.Footer class="flex-col gap-2">
      <div>
        <h1>{book.title}</h1>
        <h3>{book.author}</h3>
      </div>
    </Card.Footer>
  </Card.Root>
</a>
