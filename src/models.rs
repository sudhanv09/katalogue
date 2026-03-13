#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ReadStatus {
    ToRead,
    Reading,
    Finished,
    Dropped,
}

impl ReadStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            ReadStatus::ToRead => "to-read",
            ReadStatus::Reading => "reading",
            ReadStatus::Finished => "finished",
            ReadStatus::Dropped => "dropped",
        }
    }

    pub fn label(&self) -> &'static str {
        match self {
            ReadStatus::ToRead => "To Read",
            ReadStatus::Reading => "Reading",
            ReadStatus::Finished => "Finished",
            ReadStatus::Dropped => "Dropped",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "reading" => ReadStatus::Reading,
            "finished" => ReadStatus::Finished,
            "dropped" => ReadStatus::Dropped,
            _ => ReadStatus::ToRead,
        }
    }

    pub fn all() -> &'static [ReadStatus] {
        &[
            ReadStatus::ToRead,
            ReadStatus::Reading,
            ReadStatus::Finished,
            ReadStatus::Dropped,
        ]
    }
}

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
    pub status: ReadStatus,
}

impl Book {
    pub fn progress_percent(&self) -> f64 {
        if self.total_chapters == 0 {
            return 0.0;
        }
        (self.current_chapter as f64 / self.total_chapters as f64) * 100.0
    }
}
