import { db } from "$lib/server/db";
import { library, history } from "$lib/server/db/schema";
import { eq, desc } from 'drizzle-orm';
import { libraryToBook } from "../helpers";
import { type Book } from "../types/book";
import { type Result, ok, err } from '../types/result'

export async function get_books(): Promise<Book[]> {
    const items = await db.select().from(library);
    return Promise.all(items.map(libraryToBook))
}

export async function get_book_by_id(id: string): Promise<Result<Book, Error>> {
    const item = await db.query.library.findFirst({
        where: eq(library.id, id)
    })

    if (!item) {
        return err(new Error(`Book with id ${id} not found`))
    }

    const book = await libraryToBook(item)
    return ok(book)
}

export async function get_books_by_status(status: "to-read" | "reading" | "finished" | "dropped"): Promise<Result<Book[], Error>> {
    const item = await db.query.library.findMany({
        where: eq(library.read_status, status)
    })

    if (!item) {
        return err(new Error(`No books with ${status} found`))
    }

    const book = await Promise.all(item.map(libraryToBook))
    return ok(book)
}

export async function get_authors(): Promise<(string | null)[]> {
    const result = await db.select({ author: library.author })
        .from(library)
        .groupBy(library.author);

    return result.map(row => row.author);
}

export async function get_author_books(author: string): Promise<Result<Book[], Error>> {
    const item = await db.query.library.findMany({
        where: eq(library.author, author)
    })

    if (!item) {
        return err(new Error(`Books by ${author} not found`))
    }

    const book = await Promise.all(item.map(libraryToBook))
    return ok(book)
}

export async function get_recent(limit: number = 5) {
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

export async function drop_book(id: string) {
    return await db
        .update(library)
        .set({ read_status: 'dropped' })
        .where(eq(library.id, id))
}

