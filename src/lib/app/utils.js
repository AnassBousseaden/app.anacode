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
	};

	return {
		...store,
		clear
	};
}


/**
 * writable bound to localstorage
 * @param key localstorage key
 * @param initialValue
 * @returns {Writable<any>} writable
 */
export function localStorageIntegerWritable(key, initialValue) {
	const storedValue = localStorage.getItem(key);
	const value = storedValue !== null ? storedValue : initialValue;
	const store = writable(value);
	store.subscribe((val) => {
		localStorage.setItem(key, val);
	});
	return store;
}


export function jsonToQueryParams(json) {
	const params = new URLSearchParams(json);
	return params.toString(); // Returns query string
}

export const languageIDtoMonacoLanguageName = {
	71: 'python',
	65: 'ocaml',
	91: 'java'
};

export function langIDToMonacoLanguageName(languageID) {
	if (languageID === 71) return 'python';
	if (languageID === 65) return 'ocaml';
	if (languageID === 62) return 'java';
	if (languageID === 78) return 'kotlin';
	return 'plaintext';
}

export function getProgrammingLanguageNameFromID(programmingLanguages, languageID) {
	for (const { id, name } of programmingLanguages) {
		if (id === languageID) {
			return name;
		}
	}
	return 'Unknown';
}

export function fileNameToMonacoLanguageName(fileName) {
	if (!fileName) return 'plaintext';
	const extension = fileName.split('.').pop().toLowerCase();
	const extensionToLanguage = {
		html: 'html',
		htm: 'html',
		css: 'css',
		js: 'javascript',
		jsx: 'javascript',
		ts: 'typescript',
		tsx: 'typescript',
		json: 'json',
		java: 'java',
		py: 'python',
		rb: 'ruby',
		php: 'php',
		c: 'c',
		cpp: 'cpp',
		h: 'cpp',
		cs: 'csharp',
		go: 'go',
		rs: 'rust',
		swift: 'swift',
		kt: 'kotlin',
		md: 'markdown',
		markdown: 'markdown',
		xml: 'xml',
		yaml: 'yaml',
		yml: 'yaml',
		toml: 'ini',
		ini: 'ini',
		sql: 'sql',
		sh: 'shell',
		bash: 'shell',
		dockerfile: 'dockerfile',
		gitignore: 'plaintext',
		env: 'plaintext'
	};

	return extensionToLanguage[extension] || 'plaintext';
}
