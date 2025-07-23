import type { Book } from "./types/book";
import { UPLOAD_DIR } from "$/consts";
import { extname, join } from 'path';
import { readFile } from 'fs/promises';

type LibraryRow = {
    id: string;
    title: string | null;
    author: string | null;
    description: string | null;
    read_status: "to-read" | "reading" | "finished" | "dropped" | null;
    progress: number | null;
    cover_path: string | null;
    dir: string | null;
}

function mimeFromExt(ext: string): string {
    switch (ext.toLowerCase()) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.webp': return 'image/webp';
        case '.gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
}

async function resolveCoverPath(dir?: string, coverPath?: string | null): Promise<string> {
    if (!dir || !coverPath) return Promise.resolve('');
    const filePath = join(UPLOAD_DIR, dir, coverPath);

    try {
        const buffer = await readFile(filePath);
        const ext = extname(coverPath);
        const mime = mimeFromExt(ext);
        const base64 = buffer.toString('base64');
        return `data:${mime};base64,${base64}`;
    }
    catch (err) {
        console.error(`Failed to read cover file: ${filePath}`, err);
        return '';
    };
}

export async function libraryToBook(row: LibraryRow): Promise<Book> {
    return {
        id: row.id,
        title: row.title ?? '',
        author: row.author ?? '',
        description: row.description ?? '',
        read_status: row.read_status ?? 'to-read',
        progress: row.progress ?? 0,
        cover: await resolveCoverPath(row.dir ?? '', row.cover_path),
    };
}
