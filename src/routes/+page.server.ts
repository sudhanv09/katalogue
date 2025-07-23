import type { Actions } from '@sveltejs/kit';
import { readBook } from '@/server/parser/epub';



export const actions: Actions = {
    upload: async ({ request }) => {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file) {
            return { success: false, error: 'No file selected' };
        }

        try {
            const result = await readBook(file);
            console.log(result.getMetadata().title)
            return {
                success: true,
                parsed: result
            };
        } catch (err) {
            return { success: false, error: 'Failed to parse EPUB' };
        }
    }
};