import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { upload_file } from '@/server/services/upload-service';
import { get_books } from '@/server/services/library-service';


export const load: PageServerLoad = async () => {
    return { books: await get_books() }
};

export const actions: Actions = {
    upload: async ({ request }) => {
        const data = await request.formData();
        const files = data.getAll('file') as File[];

        if (!files || files.length === 0) {
            return { success: false, error: 'No file selected' };
        }

        try {
            const result = await upload_file(files);
            return { success: true, result };
        } catch (err) {
            return { success: false, error: 'Failed to parse EPUB' };
        }
    }
};