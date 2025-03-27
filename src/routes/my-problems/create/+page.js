// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
import {
	getExecutionContextByLanguageId,
	getProgrammingLanguageById,
	getUserProblemById
} from '$lib/api/anacode/api.anacode.ts';
import { error } from '@sveltejs/kit';

export const load = async ({ url }) => {
	try {
		const problemId = url.searchParams.get('problem_id');

		let problemData;
		let languageId;
		let languageInfo;

		if (problemId === null) {
			const languageIdParam = url.searchParams.get('language_id');
			languageId = parseInt(languageIdParam, 10);

			problemData = await buildDefaultTemplate(languageId);
		} else {
			problemData = await getUserProblemById(problemId);
			languageId = problemData.language_id;
		}
		languageInfo = await getProgrammingLanguageById(languageId);
		return {
			problemId,
			problemData,
			languageInfo
		};
	} catch (err) {
		throw error(500, err.message);
	}
};

async function buildDefaultTemplate(languageID) {
	const problemTemplate = await getExecutionContextByLanguageId(languageID);
	return {
		title: '',
		difficulty: 'Easy',
		description: '',
		language_id: languageID,
		examples: [{ input: '', output: '' }],
		driver_code: problemTemplate.driver_code,
		test_code: problemTemplate.test_code,
		additional_files: problemTemplate.additional_files
	};
}
