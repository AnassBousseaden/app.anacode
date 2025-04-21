// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = false;
export const ssr = false;

import {
	getExecutionContextByLanguageId,
	getProgrammingLanguageById
} from '$lib/api/anacode/api.anacode.ts';
import { error } from '@sveltejs/kit';

export const load = async ({ url }) => {
	try {
		const languageIdParam = url.searchParams.get('language_id');
		let languageId = parseInt(languageIdParam, 10);
		let executionContext = await getExecutionContextByLanguageId(languageId);
		let languageInfo = await getProgrammingLanguageById(languageId);
		return {
			executionContext,
			languageInfo
		};
	} catch (err) {
		throw error(500, err.message);
	}
};
