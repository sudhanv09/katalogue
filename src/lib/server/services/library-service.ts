import { db } from "$lib/server/db";
import { library, history } from "$lib/server/db/schema";
import { eq, desc } from 'drizzle-orm';

async function get_books() {
    return await db.select().from(library);
}

async function get_authors() {
    const result = await db.select({ author: library.author })
        .from(library)
        .groupBy(library.author);

    return result.map(row => row.author);
}

async function get_author_books(author: string) {
    return await db
        .select()
        .from(library)
        .where(eq(library.author, author));
}

async function get_book_by_id(id: string) {
    return await db
        .select()
        .from(library)
        .where(eq(library.id, id));
}

async function get_book_toc(id: string) { }

async function get_recent(limit: number = 5) {
    return await db
        .select({
            read_on: history.read_on,
            book: library,
        })
        .from(history)
        .innerJoin(library, eq(history.library_id, library.id))
        .orderBy(desc(history.read_on))
        .limit(limit);
}