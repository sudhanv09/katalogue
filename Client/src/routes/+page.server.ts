import type { Actions, PageServerLoad } from "./$types";

interface Book {
    id: string;
    olid: string;
    title: string;
    author: string;
    description: string;
    cover: string;
    status: number;
};



export const load: PageServerLoad = async () => {

    const booksResult: Book[] = await fetch('http://localhost:5050/library').then(res => res.json());

    console.log(booksResult)
    return { books: booksResult };
    
};

