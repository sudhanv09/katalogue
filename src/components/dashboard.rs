use dioxus::prelude::*;
use epub::doc::EpubDoc;
use std::sync::{Arc, Mutex};

use crate::db;
use crate::models::Book;
use crate::Route;

#[component]
pub fn Dashboard() -> Element {
    let conn = use_context::<Arc<Mutex<rusqlite::Connection>>>();
    let mut books = use_signal(|| {
        let conn = conn.lock().unwrap();
        db::get_all_books(&conn)
    });
    let conn_for_import = use_context::<Arc<Mutex<rusqlite::Connection>>>();

    rsx! {
        div { class: "min-h-screen bg-gray-950 text-white p-6 max-w-7xl mx-auto",
            div { class: "flex justify-between items-center mb-8",
                h1 { class: "text-2xl font-bold", "Katalogue" }
                label { class: "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-colors",
                    "Add Book"
                    input {
                        r#type: "file",
                        accept: ".epub",
                        class: "hidden",
                        onchange: move |e| {
                            if let Some(file) = e.files().first() {
                                let path = file.path();
                                let path_str = path.to_string_lossy().to_string();
                                if let Ok(mut doc) = EpubDoc::new(&path) {
                                    let title = doc
                                        .mdata("title")
                                        .map(|m| m.value.clone())
                                        .unwrap_or_else(|| "Unknown Title".to_string());
                                    let author = doc.mdata("creator").map(|m| m.value.clone());
                                    let total_chapters = doc.get_num_chapters() as i32;
                                    let cover_b64 = doc.get_cover().map(|(data, mime)| {
                                        let b64 = base64::Engine::encode(
                                            &base64::engine::general_purpose::STANDARD,
                                            &data,
                                        );
                                        format!("data:{mime};base64,{b64}")
                                    });

                                    let book = Book {
                                        id: 0,
                                        title,
                                        author,
                                        file_path: path_str,
                                        cover_b64,
                                        total_chapters,
                                        current_chapter: 0,
                                        last_read: None,
                                        added_at: chrono::Utc::now().to_rfc3339(),
                                    };

                                    let conn = conn_for_import.lock().unwrap();
                                    db::add_book(&conn, &book);
                                    let updated = db::get_all_books(&conn);
                                    books.set(updated);
                                }
                            }
                        }
                    }
                }
            }

            if books().is_empty() {
                div { class: "text-center py-20 text-gray-500",
                    p { class: "text-lg", "Your library is empty." }
                    p { "Click \"Add Book\" to import an EPUB." }
                }
            } else {
                div { class: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6",
                    for book in books() {
                        BookCard { book: book.clone(), books: books }
                    }
                }
            }
        }
    }
}

#[component]
fn BookCard(book: Book, mut books: Signal<Vec<Book>>) -> Element {
    let nav = use_navigator();
    let conn = use_context::<Arc<Mutex<rusqlite::Connection>>>();
    let book_id = book.id;
    let progress = book.progress_percent();

    rsx! {
        div {
            class: "group bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 relative",
            onclick: move |_| {
                nav.push(Route::Reader { id: book_id });
            },
            div { class: "w-full aspect-[2/3] overflow-hidden bg-gray-800",
                if let Some(ref cover) = book.cover_b64 {
                    img { class: "w-full h-full object-cover", src: "{cover}", alt: "{book.title}" }
                } else {
                    div { class: "w-full h-full flex items-center justify-center p-4 text-center bg-gradient-to-br from-gray-700 to-gray-800",
                        span { class: "text-sm font-semibold text-gray-400", "{book.title}" }
                    }
                }
            }
            div { class: "p-3",
                h3 { class: "text-sm font-semibold truncate", "{book.title}" }
                if let Some(ref author) = book.author {
                    p { class: "text-xs text-gray-400 truncate mt-0.5", "{author}" }
                }
                div { class: "h-1 bg-gray-700 rounded-full overflow-hidden mt-2",
                    div {
                        class: "h-full bg-blue-500 rounded-full transition-all",
                        style: "width: {progress:.0}%",
                    }
                }
                p { class: "text-xs text-gray-500 mt-1", "{progress:.0}%" }
            }
            button {
                class: "absolute top-2 right-2 bg-black/60 text-red-400 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20",
                onclick: move |e| {
                    e.stop_propagation();
                    let conn = conn.lock().unwrap();
                    db::delete_book(&conn, book_id);
                    let updated = db::get_all_books(&conn);
                    books.set(updated);
                },
                "x"
            }
        }
    }
}
