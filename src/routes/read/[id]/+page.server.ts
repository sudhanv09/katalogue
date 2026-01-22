import { get_chapter, start_book } from "$/lib/server/services/read-service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, params }) => {
  const chapterParam = url.searchParams.get("id");
  if (chapterParam) {
    const chapter = await get_chapter(params.id, chapterParam);
    if (chapter.ok) {
      return { item: chapter.value, bookId: params.id };
    } else {
      throw error(404, chapter.error);
    }
  }

  const read_item = await start_book(params.id);
  if (read_item.ok) return { item: read_item.value, bookId: params.id };

  throw error(404, read_item.error.message);
};
