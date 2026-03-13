use dioxus::prelude::*;
use epub::doc::EpubDoc;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use crate::db;
use crate::Route;

#[derive(Clone, PartialEq)]
struct TocEntry {
    label: String,
    depth: usize,
    spine_index: usize,
}

#[derive(Clone, Copy, PartialEq)]
enum PositionMode {
    PageXY,
    Percent,
}

fn flatten_toc(
    points: &[epub::doc::NavPoint],
    depth: usize,
    path_to_spine: &HashMap<PathBuf, usize>,
) -> Vec<TocEntry> {
    let mut entries = Vec::new();
    for point in points {
        let spine_index = path_to_spine
            .get(&point.content)
            .copied()
            .unwrap_or(0);
        entries.push(TocEntry {
            label: point.label.clone(),
            depth,
            spine_index,
        });
        entries.extend(flatten_toc(&point.children, depth + 1, path_to_spine));
    }
    entries
}

fn build_spine_map(doc: &EpubDoc<std::io::BufReader<std::fs::File>>) -> HashMap<PathBuf, usize> {
    let mut map = HashMap::new();
    for (idx, item) in doc.spine.iter().enumerate() {
        if let Some(res) = doc.resources.get(&item.idref) {
            map.insert(res.path.clone(), idx);
        }
    }
    map
}

/// Measure total column-pages via JS eval
async fn measure_pages() -> i32 {
    let mut js = document::eval(
        r#"
        const content = document.getElementById('book-content');
        if (!content) { dioxus.send(1); return; }
        const gap = 64;
        const spreadWidth = content.offsetWidth + gap;
        const pages = Math.max(1, Math.ceil(content.scrollWidth / spreadWidth));
        dioxus.send(pages);
        "#,
    );
    js.recv::<i32>().await.unwrap_or(1)
}

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
    let mut toc_open = use_signal(|| false);
    let mut page = use_signal(|| 0_i32);
    let mut total_pages = use_signal(|| 1_i32);
    let mut pos_mode = use_signal(|| PositionMode::PageXY);

    // Navigation event: +1 = forward, -1 = backward
    let mut nav_event = use_signal(|| 0_i32);

    // Load chapter HTML
    let content = use_memo(move || {
        let ch = chapter();
        let mut doc = EpubDoc::new(&file_path).ok()?;
        doc.set_current_chapter(ch);
        doc.get_current_str().map(|(html, _)| html)
    });

    // Build TOC entries with hierarchy
    let toc_entries = use_memo(move || {
        let doc = EpubDoc::new(&book.file_path).ok()?;
        let spine_map = build_spine_map(&doc);
        Some(flatten_toc(&doc.toc, 0, &spine_map))
    });

    // After chapter changes, measure total pages and reset to page 0
    use_effect(move || {
        let _ch = chapter(); // subscribe
        page.set(0);
        spawn(async move {
            let _ = document::eval("await new Promise(r => setTimeout(r, 50))").join::<bool>().await;
            total_pages.set(measure_pages().await);
        });
    });

    // Apply page transform when page signal changes
    use_effect(move || {
        let p = page();
        spawn(async move {
            document::eval(&format!(
                r#"
                const content = document.getElementById('book-content');
                if (content) {{
                    const gap = 64;
                    const spreadWidth = content.offsetWidth + gap;
                    content.style.transform = 'translateX(-' + ({p} * spreadWidth) + 'px)';
                }}
                "#
            ));
        });
    });

    // Handle navigation events
    let conn_nav = use_context::<Arc<Mutex<rusqlite::Connection>>>();
    use_effect(move || {
        let ev = nav_event();
        if ev == 0 {
            return;
        }
        // Reset so the same direction can fire again
        nav_event.set(0);

        if ev > 0 {
            // Forward
            if page() + 1 < total_pages() {
                page.set(page() + 1);
            } else if (chapter() + 1) < total {
                let next = chapter() + 1;
                chapter.set(next);
                let conn = conn_nav.lock().unwrap();
                db::update_progress(&conn, id, next as i32);
            }
        } else {
            // Backward
            if page() > 0 {
                page.set(page() - 1);
            } else if chapter() > 0 {
                let prev = chapter() - 1;
                chapter.set(prev);
                {
                    let conn = conn_nav.lock().unwrap();
                    db::update_progress(&conn, id, prev as i32);
                }
                // Jump to last page after content renders
                spawn(async move {
                    let _ = document::eval("await new Promise(r => setTimeout(r, 100))").join::<bool>().await;
                    let p = measure_pages().await;
                    total_pages.set(p);
                    page.set(p - 1);
                });
            }
        }
    });

    // Position display
    let position_text = use_memo(move || {
        match pos_mode() {
            PositionMode::PageXY => format!("{} / {}", page() + 1, total_pages()),
            PositionMode::Percent => {
                if total_pages() <= 1 {
                    "100%".to_string()
                } else {
                    let pct = ((page() as f64 + 1.0) / total_pages() as f64 * 100.0) as i32;
                    format!("{pct}%")
                }
            }
        }
    });

    rsx! {
        div {
            class: "flex flex-col h-screen bg-gray-950 text-white outline-none",
            tabindex: "0",
            onkeydown: move |e| {
                match e.key() {
                    Key::ArrowRight => nav_event.set(1),
                    Key::ArrowLeft => nav_event.set(-1),
                    _ => {}
                }
            },

            // Toolbar
            div { class: "flex items-center gap-3 px-5 py-3 bg-gray-900 border-b border-gray-800 shrink-0",
                button {
                    class: "bg-gray-700 hover:bg-gray-600 text-white px-3.5 py-1.5 rounded-md text-sm transition-colors",
                    onclick: move |_| { nav.push(Route::Dashboard {}); },
                    "Back"
                }
                button {
                    class: "bg-gray-700 hover:bg-gray-600 text-white px-3.5 py-1.5 rounded-md text-sm transition-colors",
                    onclick: move |_| toc_open.set(!toc_open()),
                    "Contents"
                }
                span { class: "font-semibold text-sm flex-1 truncate", "{book_title}" }
                span { class: "text-sm text-gray-400 whitespace-nowrap",
                    "Ch {chapter() + 1}/{total}"
                }
                button {
                    class: "text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors min-w-[60px] text-center",
                    onclick: move |_| {
                        pos_mode.set(match pos_mode() {
                            PositionMode::PageXY => PositionMode::Percent,
                            PositionMode::Percent => PositionMode::PageXY,
                        });
                    },
                    "{position_text}"
                }
            }

            // Body (relative for TOC overlay)
            div { class: "flex-1 overflow-hidden relative",
                // TOC overlay
                if toc_open() {
                    div {
                        class: "absolute inset-0 z-20 flex",
                        // Backdrop
                        div {
                            class: "absolute inset-0 bg-black/50",
                            onclick: move |_| toc_open.set(false),
                        }
                        // TOC panel
                        aside { class: "relative z-10 w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto py-4 h-full",
                            h3 { class: "text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3", "Table of Contents" }
                            if let Some(entries) = toc_entries() {
                                ul {
                                    for entry in entries {
                                        { let conn_toc = conn.clone();
                                        let spine_idx = entry.spine_index;
                                        let depth = entry.depth;
                                        rsx! {
                                            li {
                                                class: if chapter() == spine_idx {
                                                    "py-2 text-sm cursor-pointer border-l-[3px] border-blue-500 bg-gray-800/50 text-white font-semibold"
                                                } else {
                                                    "py-2 text-sm cursor-pointer border-l-[3px] border-transparent text-gray-300 hover:bg-gray-800/30"
                                                },
                                                style: "padding-left: {16 + depth * 16}px; padding-right: 16px;",
                                                onclick: move |_| {
                                                    chapter.set(spine_idx);
                                                    toc_open.set(false);
                                                    let conn = conn_toc.lock().unwrap();
                                                    db::update_progress(&conn, id, spine_idx as i32);
                                                },
                                                "{entry.label}"
                                            }
                                        }}
                                    }
                                }
                            }
                        }
                    }
                }

                // Paginated two-column reader
                div {
                    id: "page-container",
                    class: "h-full overflow-hidden px-12 py-8",
                    div {
                        id: "book-content",
                        class: "h-full transition-transform duration-300",
                        style: "column-count: 2; column-gap: 64px; column-fill: auto;",
                        if let Some(html) = content() {
                            div { dangerous_inner_html: html }
                        } else {
                            p { class: "text-gray-500", "Could not load chapter." }
                        }
                    }
                }

                // Page turn click zones (left/right edges)
                div {
                    class: "absolute inset-y-0 left-0 w-1/6 cursor-pointer z-10",
                    onclick: move |_| nav_event.set(-1),
                }
                div {
                    class: "absolute inset-y-0 right-0 w-1/6 cursor-pointer z-10",
                    onclick: move |_| nav_event.set(1),
                }
            }
        }
    }
}
