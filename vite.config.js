import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['@uiw/codemirror-themes', '@codemirror/view'] // Exclude ESM packages
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
