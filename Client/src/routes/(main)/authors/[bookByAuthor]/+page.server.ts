import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {

    const url = new URL("http://localhost:5050/library/author");
    url.searchParams.set("author", params.bookByAuthor);

    const data = await fetch(url.toString());
    const res = data.json();


    return { books: await res };
}) satisfies PageServerLoad;