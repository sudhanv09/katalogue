<script lang="ts">
	import * as Card from "$lib/shad/ui/card";
  import type { Book } from "../types";

  export let book: Book
</script>

<Card.Root>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>{book.title}</p>
  </Card.Footer>
</Card.Root>
