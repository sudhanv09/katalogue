import { start_book } from '$/lib/server/services/read-service';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const read_item = await start_book(params.id);
    if (read_item.ok)
        return { item: read_item.value };
    
    throw error(404, read_item.error.message)
};