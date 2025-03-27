// @ts-nocheck
export const prerender = true;
export const ssr = false;
import { getProgrammingLanguages, getPublicProblems } from '$lib/api/anacode/api.anacode.ts';

export const load = async () => {
	const [problems, programmingLanguages] = await Promise.all([
		getPublicProblems(),
		getProgrammingLanguages()
	]);

	return { problems: problems, programmingLanguages: programmingLanguages };
};
