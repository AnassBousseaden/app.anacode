// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import {
	getExecutionContextByLanguageId,
	getProgrammingLanguageById,
	getProgrammingLanguages,
	getUserProblemById
} from '$lib/api/anacode/api.anacode.ts';
import { error } from '@sveltejs/kit';

// todo remove cascading requests
export const load = async ({ url }) => {
	try {
		const problemId = url.searchParams.get('problem_id');

		let problemData;
		let languages = await getProgrammingLanguages();

		if (problemId === null) {
			problemData = buildDefaultTemplate();
		} else {
			problemData = await getUserProblemById(problemId);
		}
		return {
			languages,
			problemId,
			problemData
		};
	} catch (err) {
		throw error(500, err.message);
	}
};

function buildDefaultTemplate() {
	return {
		title: '',
		difficulty: 'Easy',
		description: '',
		examples: [{ input: '', output: '' }],
		execution_contexts: []
	};
}
