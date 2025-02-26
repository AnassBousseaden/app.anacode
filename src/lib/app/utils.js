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
	71: {
		language_name: 'Python (3.8.1)',
		monaco_editor_language_name: 'python'
	},
	65: {
		language_name: 'OCaml (4.09.0)',
		monaco_editor_language_name: 'ocaml'
	},
	91: {
		language_name: 'Java (JDK 17.0.6)',
		monaco_editor_language_name: 'java'
	}
};
