import { url } from '$lib/api/anacode/api.anacode.js';

export const getUserProblems = async ({ fetch }) => {
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
