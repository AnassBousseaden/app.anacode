// @ts-nocheck
export const prerender = true;
export const ssr = false;
import { url } from '$lib/api/anacode/submissions.js';

export const load = async ({ fetch }) => {
	const url_problem = `${url}/users/problems`;
	const response = await fetch(url_problem, {
		credentials: 'include',
		method: 'GET'
	});
	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}
	const problems = await response.json();
	return { problems: problems };
};
