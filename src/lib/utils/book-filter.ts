import type { Book } from '$lib/server/types/book.js';

/**
 * Filters books by title and author using case-insensitive partial matching
 * 
 * @param books - Array of books to filter
 * @param searchTerm - Search term to match against title and author
 * @returns Filtered array of books that match the search term
 */
export function filterBooks(books: Book[], searchTerm: string): Book[] {
	if (!searchTerm || !searchTerm.trim()) {
		return books;
	}

	const normalizedSearchTerm = searchTerm.toLowerCase().trim();

	return books.filter(book => {
		const title = book.title?.toLowerCase() || '';
		const author = book.author?.toLowerCase() || '';

		return title.includes(normalizedSearchTerm) || author.includes(normalizedSearchTerm);
	});
}