import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { upload_file } from '@/server/services/upload-service';
import { get_author_books, get_books, get_books_by_status } from '@/server/services/library-service';

const allowedStatuses = ["to-read", "reading", "finished", "dropped"] as const;
type BookStatus = typeof allowedStatuses[number];

export const load: PageServerLoad = async ({ url }) => {
    const statusParam = url.searchParams.get('status');
    const authorParam = url.searchParams.get('author');

    if (allowedStatuses.includes(statusParam as BookStatus)) {
        const status = statusParam as BookStatus;
        const result = await get_books_by_status(status);
        if (result.ok) return { books: result.value, status };
        return { books: [], status, error: result.error.message };
    }

    if (authorParam) {
        const res = await get_author_books(authorParam);
        if (res.ok) return { books: res.value, status: null }
    }

    return { books: await get_books(), status: null }
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