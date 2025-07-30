import { get_authors } from '$/lib/server/services/library-service';
import type { LayoutServerLoad } from './$types';

export const load = (async () => {
    return {
        authors: await get_authors()
    };
}) satisfies LayoutServerLoad;