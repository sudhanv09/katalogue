<script lang="ts">
  import * as Card from "$lib/shad/ui/card";
  import { Progress } from "$lib/shad/ui/progress";
  import type { Book } from "../types";

  export let book: Book;
  
  const p = book.progress / book.totalPages
</script>

  <Card.Root>
    <Card.Content>
      <div class="flex flex-col justify-center items-center space-y-2">
        <img
          src={`data:image/jpg;base64,${book.cover}`}
          alt="cover.jpg"
          class="max-w-96 max-h-96 w-full h-full"
        />
          <Progress class="h-1" max={1} value={p} />
      </div>
    </Card.Content>
    <Card.Footer>
      <div class="text-left">
        <a href={`/book/${book.id}`}><p>{book.title}</p></a>
        <p class="text-sm text-neutral-500">{book.author}</p>
      </div>
    </Card.Footer>
  </Card.Root>
