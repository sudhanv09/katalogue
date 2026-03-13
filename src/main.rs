use dioxus::prelude::*;
use std::sync::{Arc, Mutex};

mod components;
mod db;
mod models;

use components::dashboard::Dashboard;
use components::reader::Reader;

const FAVICON: Asset = asset!("/assets/favicon.ico");
const MAIN_CSS: Asset = asset!("/assets/main.css");
const TAILWIND_CSS: Asset = asset!("/assets/tailwind.css");

#[derive(Routable, Clone, PartialEq, Debug)]
pub enum Route {
    #[route("/")]
    Dashboard {},
    #[route("/read/:id")]
    Reader { id: i64 },
}

fn main() {
    dioxus::LaunchBuilder::new()
        .with_cfg(desktop! {
            dioxus::desktop::Config::new()
                .with_window(
                    dioxus::desktop::tao::window::WindowBuilder::new()
                        .with_title("Katalogue")
                        .with_decorations(false)
                )
        })
        .launch(App);
}

#[component]
fn App() -> Element {
    let conn = db::init_db();
    use_context_provider(|| Arc::new(Mutex::new(conn)));

    rsx! {
        document::Link { rel: "icon", href: FAVICON }
        document::Link { rel: "stylesheet", href: MAIN_CSS }
        document::Link { rel: "stylesheet", href: TAILWIND_CSS }
        Router::<Route> {}
    }
}
