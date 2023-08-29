import type { PageServerLoad } from './$types';

export const load = (async ({params}) => {
    const bookData = await fetch(`http://localhost:5050/library/${params.bookById}`);
    const response = bookData.json();
    return {book: response};
}) satisfies PageServerLoad;