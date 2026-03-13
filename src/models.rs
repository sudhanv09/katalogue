#[derive(Clone, Debug, PartialEq)]
pub struct Book {
    pub id: i64,
    pub title: String,
    pub author: Option<String>,
    pub file_path: String,
    pub cover_b64: Option<String>,
    pub total_chapters: i32,
    pub current_chapter: i32,
    pub last_read: Option<String>,
    pub added_at: String,
}

impl Book {
    pub fn progress_percent(&self) -> f64 {
        if self.total_chapters == 0 {
            return 0.0;
        }
        (self.current_chapter as f64 / self.total_chapters as f64) * 100.0
    }
}
