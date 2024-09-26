<script lang="ts">
	import * as Card from "$lib/shad/ui/card";
  import { Progress } from "$lib/shad/ui/progress";
  import type { Book } from "../types";

  export let book: Book
</script>

<div class="text-center">
  <Card.Root>
    <Card.Content>
      <img src={book.cover} alt="cover.jpg">
    </Card.Content>
    <Card.Footer>
      <div class="text-left">
        <Progress class="h-1"/>
        <a href={`/${book.id}`}><p>{book.title}</p></a>
        <p class="text-sm text-neutral-500">{book.author}</p>
      </div>
    </Card.Footer>
  </Card.Root>
</div>

