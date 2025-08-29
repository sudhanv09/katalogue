import { readBook } from "../parser/epub"
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { db } from "$lib/server/db";
import { library } from "$lib/server/db/schema";
import { customAlphabet } from "nanoid";
import { eq, and } from 'drizzle-orm';
import type { UploadResult } from "$lib/server/types/uploadresult";
import { UPLOAD_DIR } from "$/consts";

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const shortid = customAlphabet(alphabet, 5);

export async function upload_file(files: File[]) {
    const results: UploadResult[] = []
    for (const file of files) {
        let metadata;

        const book = await readBook(file);
        metadata = book.getMetadata();
        const assets = book.getImages();
        const cover = book.getCover();

        // check if the book already exists first
        const existing = await db
            .select()
            .from(library)
            .where(
                and(
                    eq(library.title, metadata.title),
                    eq(library.author, metadata.author)
                )
            )
            .get();

        if (existing) {
            results.push({
                id: file.name,
                status: 'error',
                error: 'Duplicate item'
            })
            continue;
        }

        // Prepare storage paths
        let id = shortid()
        const folderName = `${id}_${metadata.author}`;
        const bookDir = join(UPLOAD_DIR, folderName);
        const epubPath = join(bookDir, `${file.name}`);
        const assetsDir = join(bookDir, 'assets');

        // Create directories
        await mkdir(assetsDir, { recursive: true });

        const buffer = new Uint8Array(await file.arrayBuffer());
        await writeFile(epubPath, buffer);

        // write assets
        for (const asset of assets) {
            const assetBuf = book['zip'][book['resolveRelativePath'](book['opfPath'], asset['@_href'])];
            if (assetBuf) {
                const assetPath = join(assetsDir, asset['@_href']);
                await mkdir(join(assetPath, '..'), { recursive: true });
                await writeFile(assetPath, assetBuf);
            }
        }

        // 2. Insert metadata to DB
        const inserted = await db.insert(library).values({
            id: id,
            title: metadata.title,
            author: metadata.author,
            description: metadata.description,
            read_status: 'to-read',
            progress: 0,
            dir: folderName,
            cover_path: cover && join('assets', cover)
        });

        results.push({
            status: 'success',
            id: metadata.title
        })

    }

    return results
}