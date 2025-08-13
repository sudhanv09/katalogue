import { writable } from 'svelte/store';

export const searchTerm = writable<string>('');
export const debouncedSearchTerm = writable<string>('');

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

searchTerm.subscribe((value) => {
	if (debounceTimeout) {
		clearTimeout(debounceTimeout);
	}
	
	debounceTimeout = setTimeout(() => {
		debouncedSearchTerm.set(value);
	}, 300); // 300ms debounce delay
});

export function updateSearchTerm(term: string) {
	searchTerm.set(term);
}

export function clearSearch() {
	searchTerm.set('');
}

export function getSearchTerm(): string {
	let currentValue = '';
	searchTerm.subscribe(value => {
		currentValue = value;
	})();
	return currentValue;
}