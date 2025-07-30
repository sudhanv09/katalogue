import { get_book_by_id } from '$/lib/server/services/library-service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const result = await get_book_by_id(params.id);
    if (result.ok) {
        return { book: result.value };
    }

    throw error(404, result.error.message);
};