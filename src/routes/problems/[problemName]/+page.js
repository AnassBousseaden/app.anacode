import { getProgrammingLanguages, getPublicProblemById } from '$lib/api/anacode/api.anacode.ts';

// @ts-ignore
export const load = async ({ params }) => {
	const { problemName } = params;

	const [programmingLanguages, publicProblem] = await Promise.all([
		getProgrammingLanguages(),
		getPublicProblemById(problemName)
	]);

	return {
		programmingLanguages,
		publicProblem
	};
};
