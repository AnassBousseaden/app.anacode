import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const prerender = true;
export const ssr = false;

export function load() {
	throw redirect(301, `${base}/problems`);
}
