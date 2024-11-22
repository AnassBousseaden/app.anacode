// @ts-nocheck
import { url } from '$lib/api.anacode.js';

export { url };
export const userInfoKey = 'user_info';

export async function logout() {
	const url_submission = `${url}/auth/logout`;
	const response = await fetch(url_submission, {
		credentials: 'include',
		method: 'POST'
	});
	if (!response.ok) {
		throw new Error(`Error ${response.status}: ${response.error || 'Unknown error'}`);
	}
}
