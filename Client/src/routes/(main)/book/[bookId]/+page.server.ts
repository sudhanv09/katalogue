import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const bookData = await fetch(`http://localhost:5050/library/${params.bookId}`);
    const response = bookData.json();
    return { book: await response };
}) satisfies PageServerLoad;