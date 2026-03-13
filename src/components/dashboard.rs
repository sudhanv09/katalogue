use dioxus::prelude::*;
use epub::doc::EpubDoc;
use std::sync::{Arc, Mutex};

use crate::db;
use crate::models::{Book, ReadStatus};
use crate::Route;

#[derive(Clone, PartialEq)]
enum Filter {
    All,
    Status(ReadStatus),
    Author(String),
}

#[component]
pub fn Dashboard() -> Element {
    let conn = use_context::<Arc<Mutex<rusqlite::Connection>>>();
    let mut books = use_signal(|| {
        let conn = conn.lock().unwrap();
        db::get_all_books(&conn)
    });
    let conn_for_import = use_context::<Arc<Mutex<rusqlite::Connection>>>();
    let filter = use_signal(|| Filter::All);

    let filtered_books = use_memo(move || {
        let all = books();
        match filter() {
            Filter::All => all,
            Filter::Status(ref s) => all.into_iter().filter(|b| b.status == *s).collect(),
            Filter::Author(ref a) => all
                .into_iter()
                .filter(|b| b.author.as_deref() == Some(a.as_str()))
                .collect(),
        }
    });

    rsx! {
        div { class: "min-h-screen bg-gray-950 text-white flex",
            // Sidebar
            Sidebar { books: books, filter: filter }

            // Main content
            div { class: "flex-1 p-6",
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
                                            status: ReadStatus::ToRead,
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

                if filtered_books().is_empty() {
                    div { class: "text-center py-20 text-gray-500",
                        p { class: "text-lg", "No books found." }
                    }
                } else {
                    div { class: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
                        for book in filtered_books() {
                            BookCard { book: book.clone(), books: books }
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn Sidebar(books: Signal<Vec<Book>>, mut filter: Signal<Filter>) -> Element {
    let mut authors_open = use_signal(|| true);
    let mut status_open = use_signal(|| true);

    let authors = use_memo(move || {
        let mut names: Vec<String> = books()
            .iter()
            .filter_map(|b| b.author.clone())
            .collect();
        names.sort();
        names.dedup();
        names
    });

    let status_counts = use_memo(move || {
        let all = books();
        ReadStatus::all()
            .iter()
            .map(|s| {
                let count = all.iter().filter(|b| b.status == *s).count();
                (s.clone(), count)
            })
            .collect::<Vec<_>>()
    });

    rsx! {
        aside { class: "w-56 shrink-0 bg-gray-900/50 border-r border-gray-800 min-h-screen py-5 px-3 flex flex-col gap-1",
            // All books
            button {
                class: if filter() == Filter::All {
                    "w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-gray-800 text-white"
                } else {
                    "w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800/50"
                },
                onclick: move |_| filter.set(Filter::All),
                "All Books"
            }

            // Status section
            div { class: "mt-4",
                button {
                    class: "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300",
                    onclick: move |_| status_open.set(!status_open()),
                    "Status"
                    span { class: "text-[10px]",
                        if status_open() { "v" } else { ">" }
                    }
                }
                if status_open() {
                    div { class: "flex flex-col gap-0.5 mt-1",
                        for (status, count) in status_counts() {
                            { let s = status.clone();
                            let s2 = status.clone();
                            rsx! {
                                button {
                                    class: if filter() == Filter::Status(s.clone()) {
                                        "w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-white flex justify-between"
                                    } else {
                                        "w-full text-left px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800/50 flex justify-between"
                                    },
                                    onclick: move |_| filter.set(Filter::Status(s2.clone())),
                                    span { "{status.label()}" }
                                    span { class: "text-gray-500 text-xs", "{count}" }
                                }
                            }}
                        }
                    }
                }
            }

            // Authors section
            div { class: "mt-4",
                button {
                    class: "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300",
                    onclick: move |_| authors_open.set(!authors_open()),
                    "Authors"
                    span { class: "text-[10px]",
                        if authors_open() { "v" } else { ">" }
                    }
                }
                if authors_open() {
                    div { class: "flex flex-col gap-0.5 mt-1",
                        if authors().is_empty() {
                            p { class: "px-3 py-1.5 text-xs text-gray-600", "No authors yet" }
                        }
                        for author in authors() {
                            { let a = author.clone();
                            let a2 = author.clone();
                            rsx! {
                                button {
                                    class: if filter() == Filter::Author(a.clone()) {
                                        "w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-800 text-white truncate"
                                    } else {
                                        "w-full text-left px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800/50 truncate"
                                    },
                                    onclick: move |_| filter.set(Filter::Author(a2.clone())),
                                    "{author}"
                                }
                            }}
                        }
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
                div { class: "flex items-center gap-2 mt-2",
                    div { class: "flex-1 h-1 bg-gray-700 rounded-full overflow-hidden",
                        div {
                            class: "h-full bg-blue-500 rounded-full transition-all",
                            style: "width: {progress:.0}%",
                        }
                    }
                    p { class: "text-xs text-gray-500 shrink-0", "{progress:.0}%" }
                }
                select {
                    class: "mt-2 w-full text-xs bg-gray-800 text-gray-300 rounded px-1.5 py-1 border border-gray-700 cursor-pointer",
                    value: "{book.status.as_str()}",
                    onclick: move |e| { e.stop_propagation(); },
                    onchange: {
                        let conn_status = conn.clone();
                        move |e: Event<FormData>| {
                            let new_status = ReadStatus::from_str(&e.value());
                            let conn = conn_status.lock().unwrap();
                            db::update_status(&conn, book_id, &new_status);
                            let updated = db::get_all_books(&conn);
                            books.set(updated);
                        }
                    },
                    for s in ReadStatus::all() {
                        option {
                            value: "{s.as_str()}",
                            selected: book.status == *s,
                            "{s.label()}"
                        }
                    }
                }
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
