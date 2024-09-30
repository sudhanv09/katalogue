import type { PageServerLoad } from "./$types";
import type { Book } from "$lib/types";

export const load: PageServerLoad = async () => {
  const booksResult: Book[] = await fetch(
    "http://localhost:5050/library/finished"
  ).then((res) => res.json());
  return { books: booksResult };
};
