import { describe, it, expect } from 'vitest';
import { filterBooks } from './book-filter.js';
import type { Book } from '../server/types/book.js';

// Mock book data for testing
const mockBooks: Book[] = [
	{
		id: '1',
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald',
		description: 'A classic American novel',
		read_status: 'to-read',
		cover_path: '/covers/gatsby.jpg',
		progress: 0,
		dir: '/books/gatsby'
	},
	{
		id: '2',
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee',
		description: 'A novel about racial injustice',
		read_status: 'reading',
		cover_path: '/covers/mockingbird.jpg',
		progress: 50,
		dir: '/books/mockingbird'
	},
	{
		id: '3',
		title: '1984',
		author: 'George Orwell',
		description: 'A dystopian social science fiction novel',
		read_status: 'finished',
		cover_path: '/covers/1984.jpg',
		progress: 100,
		dir: '/books/1984'
	},
	{
		id: '4',
		title: null,
		author: 'Unknown Author',
		description: 'A book with no title',
		read_status: 'to-read',
		cover_path: null,
		progress: null,
		dir: null
	},
	{
		id: '5',
		title: 'Untitled Book',
		author: null,
		description: 'A book with no author',
		read_status: 'dropped',
		cover_path: null,
		progress: 25,
		dir: '/books/untitled'
	},
	{
		id: '6',
		title: null,
		author: null,
		description: 'A book with no title or author',
		read_status: 'to-read',
		cover_path: null,
		progress: null,
		dir: null
	}
];

describe('filterBooks', () => {
	describe('basic functionality', () => {
		it('should return all books when search term is empty', () => {
			const result = filterBooks(mockBooks, '');
			expect(result).toEqual(mockBooks);
		});

		it('should return all books when search term is only whitespace', () => {
			const result = filterBooks(mockBooks, '   ');
			expect(result).toEqual(mockBooks);
		});

		it('should return empty array when no books match', () => {
			const result = filterBooks(mockBooks, 'nonexistent');
			expect(result).toEqual([]);
		});
	});

	describe('title matching', () => {
		it('should filter books by exact title match', () => {
			const result = filterBooks(mockBooks, '1984');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('1984');
		});

		it('should filter books by partial title match', () => {
			const result = filterBooks(mockBooks, 'Great');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('The Great Gatsby');
		});

		it('should be case-insensitive for title matching', () => {
			const result = filterBooks(mockBooks, 'GREAT');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('The Great Gatsby');
		});

		it('should match multiple books with similar titles', () => {
			const result = filterBooks(mockBooks, 'to');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('To Kill a Mockingbird');
		});
	});

	describe('author matching', () => {
		it('should filter books by exact author match', () => {
			const result = filterBooks(mockBooks, 'Harper Lee');
			expect(result).toHaveLength(1);
			expect(result[0].author).toBe('Harper Lee');
		});

		it('should filter books by partial author match', () => {
			const result = filterBooks(mockBooks, 'Orwell');
			expect(result).toHaveLength(1);
			expect(result[0].author).toBe('George Orwell');
		});

		it('should be case-insensitive for author matching', () => {
			const result = filterBooks(mockBooks, 'HARPER LEE');
			expect(result).toHaveLength(1);
			expect(result[0].author).toBe('Harper Lee');
		});

		it('should match by first name only', () => {
			const result = filterBooks(mockBooks, 'George');
			expect(result).toHaveLength(1);
			expect(result[0].author).toBe('George Orwell');
		});
	});

	describe('combined title and author matching', () => {
		it('should match books by either title or author', () => {
			const result = filterBooks(mockBooks, 'Scott');
			expect(result).toHaveLength(1);
			expect(result[0].author).toBe('F. Scott Fitzgerald');
		});

		it('should return multiple books when search term matches different fields', () => {
			// Search for 'a' which should match "The Great Gatsby" (title) and "Harper Lee" (author contains 'a')
			const result = filterBooks(mockBooks, 'kill');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('To Kill a Mockingbird');
		});
	});

	describe('null and undefined handling', () => {
		it('should handle books with null title gracefully', () => {
			const result = filterBooks(mockBooks, 'Unknown Author');
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('4');
			expect(result[0].title).toBeNull();
		});

		it('should handle books with null author gracefully', () => {
			const result = filterBooks(mockBooks, 'Untitled');
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('5');
			expect(result[0].author).toBeNull();
		});

		it('should handle books with both null title and author', () => {
			const result = filterBooks(mockBooks, 'nonexistent');
			expect(result).toEqual([]);
		});

		it('should not match null fields when searching', () => {
			const result = filterBooks(mockBooks, 'null');
			expect(result).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should handle empty books array', () => {
			const result = filterBooks([], 'test');
			expect(result).toEqual([]);
		});

		it('should handle special characters in search term', () => {
			const booksWithSpecialChars: Book[] = [
				{
					id: '1',
					title: 'Book: A Story',
					author: 'Author & Co.',
					description: 'Test',
					read_status: 'to-read',
					cover_path: null,
					progress: null,
					dir: null
				}
			];
			
			const result = filterBooks(booksWithSpecialChars, ':');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('Book: A Story');
		});

		it('should trim whitespace from search term', () => {
			const result = filterBooks(mockBooks, '  1984  ');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('1984');
		});

		it('should handle search terms with multiple words', () => {
			const result = filterBooks(mockBooks, 'Scott Fitzgerald');
			expect(result).toHaveLength(1);
			expect(result[0].author).toBe('F. Scott Fitzgerald');
		});
	});

	describe('performance and consistency', () => {
		it('should return the same results for identical search terms', () => {
			const result1 = filterBooks(mockBooks, 'Great');
			const result2 = filterBooks(mockBooks, 'Great');
			expect(result1).toEqual(result2);
		});

		it('should not modify the original books array', () => {
			const originalBooks = [...mockBooks];
			filterBooks(mockBooks, 'test');
			expect(mockBooks).toEqual(originalBooks);
		});
	});
});