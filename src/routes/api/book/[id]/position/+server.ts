import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$/lib/server/db';
import { library } from '$/lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const { chapterId, page } = await request.json();
    
    if (!chapterId || page === undefined) {
      return json({ error: 'Missing chapterId or page' }, { status: 400 });
    }

    await db
      .update(library)
      .set({
        current_chapter_id: chapterId,
        current_page: page,
      })
      .where(eq(library.id, params.id ?? ''));

    return json({ success: true });
  } catch (error) {
    console.error('Failed to save position:', error);
    return json({ error: 'Failed to save position' }, { status: 500 });
  }
};
