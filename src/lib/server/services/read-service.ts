import { eq } from "drizzle-orm";
import { db } from "../db";
import { library } from "../db/schema";
import { err, ok, type Result } from "../types/result";
import { UPLOAD_DIR } from "$/consts";
import path, { join } from "path";
import fs from "fs/promises";
import { readBook, EpubReader } from "../parser/epub";
import { JSDOM } from 'jsdom';

type BookContent = {
  chapter: {
    id: string;
    title: string;
    html: string;
  };
  cssPaths: string[];
  toc: { id: string; title: string }[];
};

export async function get_file(dir: string): Promise<Result<EpubReader, Error>> {
  try {
    const fullPath = join(UPLOAD_DIR, dir);
    const files = await fs.readdir(fullPath);
    const epubFile = files.find((f) => f.toLowerCase().endsWith(".epub"));

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

function normalizePath(p: string): string {
  return path.posix.normalize(p).replace(/^(\.\.\/|\.\/)+/, '');
}


function intercept_html_resources(
  html: string,
  bookId: string
): { cleanHtml: string; cssPaths: string[] } {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const cssPaths: string[] = [];

  document.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      const normalized = normalizePath(src);
      const encodedSrc = encodeURIComponent(normalized);
      img.setAttribute("src", `/api/book/${bookId}/resource/${encodedSrc}`);
    }
  });

  document.querySelectorAll("image").forEach((image) => {
    const href = image.getAttribute("xlink:href") || image.getAttribute("href");
    if (href) {
      const normalized = normalizePath(href);
      const encodedHref = encodeURIComponent(normalized);
      image.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `/api/book/${bookId}/resource/${encodedHref}`);
    }
  });


  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      const encodedHref = encodeURIComponent(href);
      cssPaths.push(`/api/book/${bookId}/resource/${encodedHref}`);
    }
    link.remove();
  });

  return {
    cleanHtml: document.body.innerHTML,
    cssPaths,
  };
}

export async function get_chapter(
  bookId: string,
  chapterId: string
): Promise<Result<BookContent, Error>> {
  const item = await db.query.library.findFirst({
    where: eq(library.id, bookId),
  });
  if (!item || !item.dir) return err(new Error(`Item ${bookId} not found`));

  const bookResult = await get_file(item.dir);
  if (!bookResult.ok) return err(bookResult.error);

  const book = bookResult.value;
  const chapter = book.getChapter(chapterId);
  if (!chapter) {
    return err(new Error(`Chapter ${chapterId} not found in book ${bookId}`));
  }

  const { cleanHtml, cssPaths } = intercept_html_resources(
    chapter.content,
    bookId
  );

  return ok({
    chapter: {
      id: chapter.id,
      title: chapter.title,
      html: cleanHtml,
    },
    cssPaths: cssPaths,
    toc: book.getToc(),
  });
}

export async function start_book(
  id: string
): Promise<Result<BookContent, Error>> {
  const item = await db.query.library.findFirst({ where: eq(library.id, id) });

  if (!item || !item.dir) return err(new Error(`Item ${id} not found`));

  const result = await get_file(item.dir);
  if (!result.ok) return err(result.error);

  const book = result.value;
  const firstChapter = book.getChapters()[0];
  const startChapterId = item.progress === 0 ? firstChapter?.id : item.progress?.toString();

  if (!startChapterId) {
    return err(new Error("Book has no chapters."));
  }

  return get_chapter(id, startChapterId);
}

export async function get_book_toc(id: string) { }
