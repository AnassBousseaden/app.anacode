// @ts-nocheck
import { url } from '$lib/api/anacode/api.anacode.ts';

export { url, sessionAuthRessource };
const authStoreKey = 'auth_store';
const sessionAuthRessource = 'session:auth';

// ----- network call
export async function logout() {
	const url_submission = `${url}/auth/logout`;
	const response = await fetch(url_submission, {
		credentials: 'include',
		method: 'POST'
	});
	if (!response.ok) {
		throw new Error(`Error ${response.status}: ${response.error || 'Unknown error'}`);
	}
	console.log('attempte to invalidate after login');
	console.log('invalidated:');
}

// ----- centralized login management

import { writable } from 'svelte/store';
import { invalidate } from '$app/navigation';

class AuthStore {
	#defaultValue = { isAuthenticated: false, userInfo: null };

	constructor() {
		console.log('AuthStore initialized');
		this.store = writable(this.#getInitialAuth());

		// Listen for localStorage changes (e.g., from another tab) and update the store.
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', (event) => {
				console.log('even listener triggers refresh');
				if (event.key === authStoreKey) {
					this.refresh();
				}
			});
		}
	}

	// Retrieve initial authentication state from localStorage.
	#getInitialAuth() {
		console.log('AuthStore initialized...');
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(authStoreKey);
			return stored ? JSON.parse(stored) : this.#defaultValue;
		}
		return this.#defaultValue;
	}

	// Expose subscribe method for Svelte reactivity.
	subscribe(run, invalidate) {
		return this.store.subscribe(run, invalidate);
	}

	// Update the authentication state on login.
	setAuth(userInfo) {
		console.log('auth store setAuth');
		invalidate(sessionAuthRessource);
		const auth = { isAuthenticated: true, userInfo: userInfo };
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(authStoreKey, JSON.stringify(auth));
		}
		this.store.set(auth);
	}

	// Reset the authentication state on logout.
	logout() {
		console.log('auth store logout');
		const auth = this.#defaultValue;
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(authStoreKey);
		}
		this.store.set(auth);
	}

	// Refresh the store from the current localStorage state.
	refresh() {
		console.log('auth store refresh');
		this.store.set(this.#getInitialAuth());
	}
}

export const authStore = new AuthStore();
