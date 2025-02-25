// @ts-nocheck
export const prerender = false;
export const ssr = false;
import { getUserProblems } from '$lib/api/anacode/api.anacode.js';

export const load = async () => {
	try {
		const problems = await getUserProblems();
		console.log('fetched problems', problems);
		return { problems: problems };
	} catch (err) {
		// Return the error so the page can render a friendly message
		return { error: err.message };
	}
};
