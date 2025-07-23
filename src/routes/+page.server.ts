import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { toast } from 'svelte-sonner';
import { upload_file } from '@/server/services/upload-service';
import { get_books } from '@/server/services/library-service';
import type { Book } from '@/server/types/book';


export const load: PageServerLoad = async () => {
    return { books: await get_books() }
};

export const actions: Actions = {
    upload: async ({ request }) => {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file) {
            return { success: false, error: 'No file selected' };
        }

        try {
            const result = await upload_file([file]);
            result.forEach(item => {
                if (item.status === 'error') {
                    toast(`Error ${item.error}`)
                } else {
                    toast(`Item: ${item.id} uploaded successfully`)
                }
            });
        } catch (err) {
            return { success: false, error: 'Failed to parse EPUB' };
        }
    }
};