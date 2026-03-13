use dioxus::prelude::*;
use epub::doc::EpubDoc;

const FAVICON: Asset = asset!("/assets/favicon.ico");
const MAIN_CSS: Asset = asset!("/assets/main.css");
const TAILWIND_CSS: Asset = asset!("/assets/tailwind.css");

fn main() {
    dioxus::launch(App);
}

fn get_title(path: &std::path::Path) -> Option<String> {
    let doc = EpubDoc::new(path).ok()?;
    doc.mdata("title").map(|m| m.value.clone())
}

#[component]
fn App() -> Element {
    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: MAIN_CSS }
        document::Link { rel: "stylesheet", href: TAILWIND_CSS }
        LoadEpub {}
    }
}

#[component]
fn LoadEpub() -> Element {
    let mut title = use_signal(|| String::new());
    rsx! {
        input {
            r#type: "file",
            accept: ".epub",
            onchange: move |e| {
                if let Some(file) = e.files().first() {
                    if let Some(t) = get_title(&file.path()) {
                        title.set(t);
                    }
                }
            }
        }
        if !title().is_empty() {
            p { "Title: {title}" }
        }
    }
}
