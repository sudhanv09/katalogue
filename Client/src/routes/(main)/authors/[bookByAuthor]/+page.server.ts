import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {

    const url = new URL("http://localhost:5050/library/author");
    url.searchParams.set("author", params.bookByAuthor);

    const data = await fetch(url.toString()).then((res) => res.json());

    return { data };
}) satisfies PageServerLoad;