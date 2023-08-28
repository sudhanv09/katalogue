import type { Book } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const booksResult: Book[] = await fetch('http://localhost:5050/library').then(res => res.json());
        
    return { books: booksResult};
}) satisfies PageServerLoad;
