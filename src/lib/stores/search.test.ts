import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { searchTerm, debouncedSearchTerm, updateSearchTerm, clearSearch, getSearchTerm } from './search';

describe('Search Store', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		clearSearch(); // Reset store before each test
		// Also reset the debounced store
		debouncedSearchTerm.set('');
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should initialize with empty string', () => {
		expect(get(searchTerm)).toBe('');
		expect(get(debouncedSearchTerm)).toBe('');
	});

	it('should update search term immediately', () => {
		updateSearchTerm('test');
		expect(get(searchTerm)).toBe('test');
	});

	it('should debounce search term updates', () => {
		updateSearchTerm('test');
		
		// Debounced value should still be empty initially
		expect(get(debouncedSearchTerm)).toBe('');
		
		// Fast forward time by 300ms
		vi.advanceTimersByTime(300);
		
		// Now debounced value should be updated
		expect(get(debouncedSearchTerm)).toBe('test');
	});

	it('should clear search term', () => {
		updateSearchTerm('test');
		clearSearch();
		expect(get(searchTerm)).toBe('');
	});

	it('should get current search term value', () => {
		updateSearchTerm('test');
		expect(getSearchTerm()).toBe('test');
	});

	it('should handle rapid updates with debouncing', () => {
		updateSearchTerm('a');
		vi.advanceTimersByTime(100);
		
		updateSearchTerm('ab');
		vi.advanceTimersByTime(100);
		
		updateSearchTerm('abc');
		vi.advanceTimersByTime(100);
		
		// Debounced value should still be empty
		expect(get(debouncedSearchTerm)).toBe('');
		
		// Fast forward to complete the debounce
		vi.advanceTimersByTime(200);
		
		// Should have the final value
		expect(get(debouncedSearchTerm)).toBe('abc');
	});
});