import { eq } from "drizzle-orm";
import { db } from "../db";
import { library } from "../db/schema";
import { err, ok, type Result } from "../types/result";
import { UPLOAD_DIR } from "$/consts";
import path, { join } from "path";
import fs from "fs/promises";
import { readBook, EpubReader } from "../parser/epub";
import { JSDOM } from "jsdom";
import { updateBookProgress, createHistoryEntry } from "./library-service";

type BookContent = {
  bookId: string;
  chapter: {
    id: string;
    title: string;
    html: string;
  };
  toc: { id: string; title: string, href: string }[];
  currentPage?: number;
};

export async function get_file(
  dir: string
): Promise<Result<EpubReader, Error>> {
  try {
    const fullPath = join(UPLOAD_DIR, dir);
    const files = await fs.readdir(fullPath);
    const epubFile = files.find((f) => f.toLowerCase().endsWith(".epub"));

    if (!epubFile) {
      return err(new Error(`No .epub file found in ${fullPath}`));
    }

    const epubPath = join(fullPath, epubFile);
    const buffer = await fs.readFile(epubPath);
    const file = new File([new Uint8Array(buffer)], epubFile);
    const book = await readBook(file);

    return ok(book);
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

function normalizePath(p: string): string {
  return path.posix.normalize(p).replace(/^(\.\.\/|\.\/)+/, "");
}

function intercept_html_resources(html: string, bookId: string): string {
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
      image.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        `/api/book/${bookId}/resource/${encodedHref}`
      );
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

  return document.body.innerHTML;
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

  // update progress
  const total_chapters = book.getChapters();
  if (total_chapters.length === 0) {
    return err(new Error("Book has no chapters"));
  }

  const currentChapterIndex = total_chapters.findIndex(chp => chapter.id === chapterId);
  if (currentChapterIndex === -1) {
    return err(new Error(`Chapter ${chapterId} not found in book`));
  }

  const progress = Math.round(((currentChapterIndex + 1) / total_chapters.length) * 100);
  let status: "reading" | "finished" | undefined;
  if (progress >= 100) {
    status = "finished";
  } else if (item.read_status === "to-read") {
    status = "reading";
  }
  const success = await updateBookProgress(bookId, progress, status);
  if (!success.ok) {
    return err(new Error(`Failed to update progress: ${success.error}`));
  }

  const cleanHtml = intercept_html_resources(chapter.content, bookId);

  return ok({
    bookId,
    chapter: {
      id: chapter.id,
      title: chapter.title,
      html: cleanHtml,
    },
    toc: book.getToc(),
    currentPage: item.current_chapter_id === chapterId ? (item.current_page ?? 0) : 0,
  });
}

export async function updateProgressByChapter(
  bookId: string,
  currentChapterId: string
): Promise<Result<void, Error>> {
  try {
    const item = await db.query.library.findFirst({
      where: eq(library.id, bookId)
    });

    if (!item || !item.dir) {
      return err(new Error(`Book with id ${bookId} not found`));
    }

    const bookResult = await get_file(item.dir);
    if (!bookResult.ok) {
      return err(bookResult.error);
    }

    const book = bookResult.value;
    const chapters = book.getChapters();

    if (chapters.length === 0) {
      return err(new Error("Book has no chapters"));
    }

    const currentChapterIndex = chapters.findIndex(chapter => chapter.id === currentChapterId);
    if (currentChapterIndex === -1) {
      return err(new Error(`Chapter ${currentChapterId} not found in book`));
    }

    const progress = Math.round(((currentChapterIndex + 1) / chapters.length) * 100);

    let status: "reading" | "finished" | undefined;
    if (progress >= 100) {
      status = "finished";
    } else if (item.read_status === "to-read") {
      status = "reading";
    }

    const updateResult = await updateBookProgress(bookId, progress, status);
    if (!updateResult.ok) {
      return err(updateResult.error);
    }

    return ok(undefined);
  } catch (error) {
    return err(error instanceof Error ? error : new Error("Failed to update progress by chapter"));
  }
}

export async function start_book(
  id: string
): Promise<Result<BookContent, Error>> {
  const item = await db.query.library.findFirst({ where: eq(library.id, id) });

  if (!item || !item.dir) return err(new Error(`Item ${id} not found`));

  // Mark book as reading when user starts reading
  if (item.read_status === "to-read") {
    const updateResult = await updateBookProgress(item.id, item.progress || 0, "reading");
    if (!updateResult.ok) {
      return err(updateResult.error);
    }
  } else {
    // Still create history entry even if status doesn't change
    const historyResult = await createHistoryEntry(item.id);
    if (!historyResult.ok) {
      return err(historyResult.error);
    }
  }

  const result = await get_file(item.dir);
  if (!result.ok) return err(result.error);

  const book = result.value;
  const chapters = book.getChapters();
  
  if (chapters.length === 0) {
    return err(new Error("Book has no chapters."));
  }

  let startChapterId: string;
  if (item.current_chapter_id && chapters.find(c => c.id === item.current_chapter_id)) {
    // Resume from saved position
    startChapterId = item.current_chapter_id;
  } else if (!item.progress || item.progress === 0) {
    // Start from the beginning
    startChapterId = chapters[0].id;
  } else {
    // Calculate chapter index from progress percentage
    const chapterIndex = Math.floor((item.progress / 100) * chapters.length);
    const safeIndex = Math.min(chapterIndex, chapters.length - 1);
    startChapterId = chapters[safeIndex].id;
  }

  return get_chapter(id, startChapterId);
}
