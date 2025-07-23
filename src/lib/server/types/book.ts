
export type Book = {
    id: string;
    title: string;
    author: string;
    description: string;
    read_status: "to-read" | "reading" | "finished" | "dropped";
    cover: string;
    progress: number;
}