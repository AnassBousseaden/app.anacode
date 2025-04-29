// @ts-nocheck
import { sessionAuthRessource } from '$lib/api/anacode/auth.js';

export const prerender = false;
export const ssr = false;
import { getUserProblems, getProgrammingLanguages } from '$lib/api/anacode/api.anacode.ts';

export async function load({ depends }) {
	try {
		depends(sessionAuthRessource);
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
}
