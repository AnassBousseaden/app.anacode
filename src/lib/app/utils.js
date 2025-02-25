import { writable } from 'svelte/store';

/**
 * writable bound to localstorage
 * @param key localstorage key
 * @param initialValue
 * @returns {Writable<any>} writable
 */
export function localStorageWritable(key, initialValue) {
	const storedValue = localStorage.getItem(key);
	const value = storedValue !== null ? storedValue : initialValue;
	const store = writable(value);
	store.subscribe((val) => {
		localStorage.setItem(key, val);
	});
	return store;
}

/**
 * writable bound to localstorage
 * @param key localstorage key
 * @param initialObject json object
 * @returns {Writable<any>} writable
 */
export function localStorageJsonWritable(key, initialObject) {
	const storedValue = localStorage.getItem(key);
	const value = storedValue !== null ? JSON.parse(storedValue) : initialObject;
	const store = writable(value);

	store.subscribe((val) => {
		localStorage.setItem(key, JSON.stringify(val));
	});

	// Add clear method to remove data from localStorage
	const clear = () => {
		localStorage.removeItem(key);
		store.set(initialObject);
	};

	return {
		...store,
		clear
	};
}

export function jsonToQueryParams(json) {
	const params = new URLSearchParams(json);
	return params.toString(); // Returns query string
}

// Map language IDs to readable language names
export const languageMap = {
  71: 'Python 3'
};