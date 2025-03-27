// @ts-nocheck
export const prerender = false;
export const ssr = false;
import { getUserProblems, getProgrammingLanguages } from '$lib/api/anacode/api.anacode.ts';

export const load = async () => {
	try {
		// Run both calls in parallel
		const [problems, programmingLanguages] = await Promise.all([
			getUserProblems(),
			getProgrammingLanguages()
		]);

		return {
			problems,
			programmingLanguages
		};
	} catch (err) {
		return { error: err.message };
	}
};
