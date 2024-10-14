import type { Book } from '$src/lib/types';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
    const recentBook: Book[] = await fetch("http://localhost:5050/library/recent").then((res) => res.json())
    return {recent : recentBook};
}) satisfies LayoutServerLoad;