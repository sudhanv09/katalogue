export interface Book {
    id: string;
    olid: string;
    title: string;
    author: string;
    description: string;
    cover: string;
    status: BookStatus;
    progress: number;
    totalPages: number;
    lastRead: string;
};

export enum BookStatus {
    Reading = 0,
    ToRead = 1,
    Finished = 2
}