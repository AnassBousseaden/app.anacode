// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import { getUserProblemById, url } from '$lib/api/anacode/api.anacode.js';
import { sample_driver_code, sample_test_code } from '$lib/app/create/Content.js';
import { error } from '@sveltejs/kit';

export const prerender = false;
export const ssr = false;

const defaultProblemDataTemplate = {
	title: '',
	difficulty: 'Easy',
	description: '',
	language_id: 71,
	examples: [{ input: '', output: '' }],
	driver_code: sample_driver_code,
	test_code: sample_test_code
};

export const load = async ({ url }) => {
	try {
		const problemParam = 'problem_id';
		const problemId = url.searchParams.get(problemParam);
		let problemData;
		if (problemId === null) {
			problemData = defaultProblemDataTemplate;
		} else {
			problemData = await getUserProblemById(problemId);
		}
		return {
			problemId: problemId,
			problemData: problemData
		};
	} catch (err) {
		throw error(500, err.message);
	}
};
