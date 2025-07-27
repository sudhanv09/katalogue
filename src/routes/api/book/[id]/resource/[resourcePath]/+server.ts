import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { library } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { get_file } from "$/lib/server/services/read-service";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {    
    const id = params.id ?? '';
    const resourcePath = decodeURIComponent(params.resourcePath ?? '');

  const item = await db.query.library.findFirst({ where: eq(library.id, id) });
  if (!item || !item.dir) {
    throw error(404, "Book not found");
  }

  const bookResult = await get_file(item.dir);
  if (!bookResult.ok) {
    throw error(500, `Failed to parse book: ${bookResult.error.message}`);
  }

  const book = bookResult.value;

  const resource = book.getResourceByHref(resourcePath);

  if (!resource) {
    throw error(404, "Resource not found in EPUB");
  }

  const headers = new Headers();
  headers.set("Content-Type", resource.mediaType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable"); // Cache resources aggressively

  return new Response(resource.data, { headers });
};
