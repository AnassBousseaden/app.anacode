import { redirect } from '@sveltejs/kit';

export const prerender = true;
export const ssr = false;

export function load() {
	throw redirect(301, '/problems');
}
