import type { PageServerLoad } from './$types';
import type { Book } from '$lib/types';

export const load = (async () => {
	const authorResult: Book[] = await fetch('http://localhost:5050/library/author/list').then((res) =>
		res.json()
	);

	return { authors: await authorResult };

}) satisfies PageServerLoad;
