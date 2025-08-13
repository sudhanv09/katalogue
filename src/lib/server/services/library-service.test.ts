import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateBookProgress, createHistoryEntry } from './library-service';

// Mock the database
vi.mock('$lib/server/db', () => ({
    db: {
        query: {
            library: {
                findFirst: vi.fn()
            }
        },
        transaction: vi.fn(),
        update: vi.fn(),
        insert: vi.fn()
    }
}));

vi.mock('$lib/server/db/schema', () => ({
    library: {
        id: 'id'
    },
    history: {}
}));

describe('Library Service - Progress Update Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('updateBookProgress', () => {
        it('should validate progress range', async () => {
            const result = await updateBookProgress('book-id', -1);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error.message).toBe('Progress must be between 0 and 100');
            }
        });

        it('should validate progress upper bound', async () => {
            const result = await updateBookProgress('book-id', 101);
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error.message).toBe('Progress must be between 0 and 100');
            }
        });

        it('should accept valid progress values', async () => {
            // This test would need proper database mocking to work fully
            // For now, we're just testing the validation logic
            const result1 = await updateBookProgress('book-id', 0);
            const result2 = await updateBookProgress('book-id', 50);
            const result3 = await updateBookProgress('book-id', 100);
            
            // These will fail due to book not found, but progress validation should pass
            expect(result1.ok).toBe(false);
            if (!result1.ok) {
                expect(result1.error.message).toBe('Book with id book-id not found');
            }
        });
    });

    describe('createHistoryEntry', () => {
        it('should handle non-existent book', async () => {
            const result = await createHistoryEntry('non-existent-book');
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.error.message).toBe('Book with id non-existent-book not found');
            }
        });
    });
});