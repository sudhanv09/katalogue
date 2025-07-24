import { eq } from "drizzle-orm";
import { db } from "../db";
import { library } from "../db/schema";
import { err, ok, type Result } from "../types/result";
import { UPLOAD_DIR } from "$/consts";
import { join } from "path";
import fs from 'fs/promises';
import { readBook, EpubReader } from "../parser/epub";

type BookContent = {
    chapter: {
        id: string
        html: string
    },
    metadata: ReturnType<EpubReader['getMetadata']>,
    css: { href: string, content: string }[],
    images: { href: string, data: Uint8Array }[]
}


export async function get_file(dir: string): Promise<Result<EpubReader, Error>> {
    try {
        const fullPath = join(UPLOAD_DIR, dir);
        const files = await fs.readdir(fullPath);
        const epubFile = files.find(f => f.toLowerCase().endsWith('.epub'));

        if (!epubFile) {
            return err(new Error(`No .epub file found in ${fullPath}`));
        }

        const epubPath = join(fullPath, epubFile);
        const buffer = await fs.readFile(epubPath);
        const file = new File([buffer], epubFile);
        const book = await readBook(file);

        return ok(book);
    } catch (e) {
        return err(e instanceof Error ? e : new Error(String(e)));
    }
}

async function get_next_chapter() { }

async function get_prev_chapter() { }

function intercept_imgs(html: string, book: EpubReader) { }


export async function start_book(id: string): Promise<Result<BookContent, Error>> {
    const item = await db.query.library.findFirst({ where: eq(library.id, id) })

    if (!item || !item.dir) return err(new Error(`Item ${id} not found`))

    const result = await get_file(item.dir);
    if (!result.ok) return err(result.error);

    const book = result.value;
    const firstChapter = book.getChapters()[0];
    if (!firstChapter) return err(new Error('No chapters found in book'));

    const css = book.getCss().map(css => {
        const path = book['resolveRelativePath'](book['opfPath'], css['@_href']);
        return {
            href: css['@_href'],
            content: new TextDecoder().decode(book['zip'][path])
        };
    });

    const images = book.getImages().map(img => {
        const path = book['resolveRelativePath'](book['opfPath'], img['@_href']);
        return {
            href: img['@_href'],
            data: book['zip'][path]
        };
    });

    const res: BookContent = {
        chapter: {
            id: firstChapter.id,
            html: firstChapter.content
        },
        metadata: book.getMetadata(),
        css,
        images
    }

    return ok(res)
}

export async function get_book_toc(id: string) { }
