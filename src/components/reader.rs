use dioxus::prelude::*;
use epub::doc::EpubDoc;
use std::sync::{Arc, Mutex};

use crate::db;
use crate::Route;

#[component]
pub fn Reader(id: i64) -> Element {
    let conn = use_context::<Arc<Mutex<rusqlite::Connection>>>();
    let nav = use_navigator();

    let book = {
        let conn = conn.lock().unwrap();
        db::get_book(&conn, id)
    };

    let Some(book) = book else {
        return rsx! {
            div { class: "min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center",
                p { class: "text-lg", "Book not found." }
                button {
                    class: "mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors",
                    onclick: move |_| { nav.push(Route::Dashboard {}); },
                    "Back to Library"
                }
            }
        };
    };

    let mut chapter = use_signal(|| book.current_chapter as usize);
    let total = book.total_chapters as usize;
    let file_path = book.file_path.clone();
    let book_title = book.title.clone();

    let content = use_memo(move || {
        let ch = chapter();
        let mut doc = EpubDoc::new(&file_path).ok()?;
        doc.set_current_chapter(ch);
        doc.get_current_str().map(|(html, _)| html)
    });

    let toc = use_memo(move || {
        let doc = EpubDoc::new(&book.file_path).ok()?;
        Some(
            doc.toc
                .iter()
                .map(|nav| nav.label.clone())
                .collect::<Vec<_>>(),
        )
    });

    let conn_prev = use_context::<Arc<Mutex<rusqlite::Connection>>>();
    let conn_next = use_context::<Arc<Mutex<rusqlite::Connection>>>();

    rsx! {
        div { class: "flex flex-col h-screen bg-gray-950 text-white",
            // Toolbar
            div { class: "flex items-center gap-4 px-5 py-3 bg-gray-900 border-b border-gray-800 shrink-0",
                button {
                    class: "bg-gray-700 hover:bg-gray-600 text-white px-3.5 py-1.5 rounded-md text-sm transition-colors",
                    onclick: move |_| { nav.push(Route::Dashboard {}); },
                    "Back"
                }
                span { class: "font-semibold text-sm flex-1 truncate", "{book_title}" }
                span { class: "text-sm text-gray-400 whitespace-nowrap", "Chapter {chapter() + 1} / {total}" }
            }
            // Body
            div { class: "flex flex-1 overflow-hidden",
                // TOC sidebar
                aside { class: "w-64 shrink-0 bg-gray-900/50 border-r border-gray-800 overflow-y-auto py-4",
                    h3 { class: "text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3", "Contents" }
                    if let Some(toc_items) = toc() {
                        ul {
                            for (i, label) in toc_items.iter().enumerate() {
                                { let conn_toc = conn.clone();
                                rsx! {
                                    li {
                                        class: if i == chapter() {
                                            "px-4 py-2 text-sm cursor-pointer border-l-[3px] border-blue-500 bg-gray-800/50 text-white font-semibold"
                                        } else {
                                            "px-4 py-2 text-sm cursor-pointer border-l-[3px] border-transparent text-gray-300 hover:bg-gray-800/30"
                                        },
                                        onclick: move |_| {
                                            chapter.set(i);
                                            let conn = conn_toc.lock().unwrap();
                                            db::update_progress(&conn, id, i as i32);
                                        },
                                        "{label}"
                                    }
                                }}
                            }
                        }
                    }
                }
                // Chapter content
                div { class: "flex-1 overflow-y-auto",
                    div { class: "max-w-3xl mx-auto px-12 py-8 leading-relaxed text-base",
                        if let Some(html) = content() {
                            div { dangerous_inner_html: html }
                        } else {
                            p { class: "text-gray-500", "Could not load chapter." }
                        }
                        div { class: "flex justify-between pt-6 mt-8 border-t border-gray-800",
                            button {
                                class: "bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm transition-colors",
                                disabled: chapter() == 0,
                                onclick: move |_| {
                                    let prev = chapter().saturating_sub(1);
                                    chapter.set(prev);
                                    let conn = conn_prev.lock().unwrap();
                                    db::update_progress(&conn, id, prev as i32);
                                },
                                "Previous"
                            }
                            button {
                                class: "bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm transition-colors",
                                disabled: chapter() + 1 >= total,
                                onclick: move |_| {
                                    let next = chapter() + 1;
                                    if next < total {
                                        chapter.set(next);
                                        let conn = conn_next.lock().unwrap();
                                        db::update_progress(&conn, id, next as i32);
                                    }
                                },
                                "Next"
                            }
                        }
                    }
                }
            }
        }
    }
}
