
export type Book = {
    id: string;
    title: string | null;
    author: string | null;
    description: string | null;
    read_status: "to-read" | "reading" | "finished" | "dropped";
    cover_path: string | null;
    progress: number | null;
    dir: string | null;
    cover?: string; // Computed field for UI
}