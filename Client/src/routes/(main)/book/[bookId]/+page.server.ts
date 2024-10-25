import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const bookData = await fetch(`http://localhost:5050/library/${params.bookId}`).then((res) => res.json());
    return { bookData };
}) satisfies PageServerLoad;