use crate::models::Book;
use rusqlite::{Connection, params};
use std::path::PathBuf;

pub fn db_path() -> PathBuf {
    let mut path = dirs_home().join(".katalogue");
    std::fs::create_dir_all(&path).ok();
    path.push("katalogue.db");
    path
}

fn dirs_home() -> PathBuf {
    std::env::var("HOME")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("."))
}

pub fn init_db() -> Connection {
    let conn = Connection::open(db_path()).expect("Failed to open database");
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT,
            file_path TEXT NOT NULL,
            cover_b64 TEXT,
            total_chapters INTEGER NOT NULL DEFAULT 0,
            current_chapter INTEGER NOT NULL DEFAULT 0,
            last_read TEXT,
            added_at TEXT NOT NULL
        );",
    )
    .expect("Failed to create table");
    conn
}

pub fn add_book(conn: &Connection, book: &Book) -> i64 {
    conn.execute(
        "INSERT INTO books (title, author, file_path, cover_b64, total_chapters, current_chapter, added_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
        params![
            book.title,
            book.author,
            book.file_path,
            book.cover_b64,
            book.total_chapters,
            book.current_chapter,
            book.added_at,
        ],
    )
    .expect("Failed to insert book");
    conn.last_insert_rowid()
}

pub fn get_all_books(conn: &Connection) -> Vec<Book> {
    let mut stmt = conn
        .prepare("SELECT id, title, author, file_path, cover_b64, total_chapters, current_chapter, last_read, added_at FROM books ORDER BY last_read DESC, added_at DESC")
        .expect("Failed to prepare statement");

    stmt.query_map([], |row| {
        Ok(Book {
            id: row.get(0)?,
            title: row.get(1)?,
            author: row.get(2)?,
            file_path: row.get(3)?,
            cover_b64: row.get(4)?,
            total_chapters: row.get(5)?,
            current_chapter: row.get(6)?,
            last_read: row.get(7)?,
            added_at: row.get(8)?,
        })
    })
    .expect("Failed to query books")
    .filter_map(|r| r.ok())
    .collect()
}

pub fn get_book(conn: &Connection, id: i64) -> Option<Book> {
    conn.query_row(
        "SELECT id, title, author, file_path, cover_b64, total_chapters, current_chapter, last_read, added_at FROM books WHERE id = ?1",
        params![id],
        |row| {
            Ok(Book {
                id: row.get(0)?,
                title: row.get(1)?,
                author: row.get(2)?,
                file_path: row.get(3)?,
                cover_b64: row.get(4)?,
                total_chapters: row.get(5)?,
                current_chapter: row.get(6)?,
                last_read: row.get(7)?,
                added_at: row.get(8)?,
            })
        },
    )
    .ok()
}

pub fn update_progress(conn: &Connection, id: i64, chapter: i32) {
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "UPDATE books SET current_chapter = ?1, last_read = ?2 WHERE id = ?3",
        params![chapter, now, id],
    )
    .ok();
}

pub fn delete_book(conn: &Connection, id: i64) {
    conn.execute("DELETE FROM books WHERE id = ?1", params![id]).ok();
}
