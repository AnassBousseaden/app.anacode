import { url } from '$lib/submissions';

export const prerender = false;
export const ssr = false;

// @ts-ignore
export const load = async ({ params, fetch }) => {
	const { problemName } = params;
	const url_problem = `${url}/problems/${problemName}`;
	const response = await fetch(url_problem);
	if (!response.ok) {
		throw new Error('Failed to fetch data');
	}
	const problem = await response.json();
	return problem;
};
