<script lang="ts">
	import MultiFileView from '$lib/app/components/create/multi-file-editor/multi-file-view.svelte';
	import { getExecutionContextByLanguageId, getProgrammingLanguageById } from '$lib/api/anacode/api.anacode.js';
	import type { Language, PrivateExecutionContext } from '$lib/api/anacode/models';
	import type { Directory, File } from '$lib/app/components/create/multi-file-editor/file.manager';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { buildDirectoryStructure } from '$lib/app/components/create/multi-file-editor/executionContext.file.manager';

	let rootDirectory: Writable<Directory> = null;

	onMount(async () => {
		const languageID = '62';
		let defaultJavaExecutionContext: PrivateExecutionContext;
		let languageInfo: Language;
		let mainFile: File;
		let solutionFile: File;
		defaultJavaExecutionContext = await getExecutionContextByLanguageId(languageID);
		languageInfo = await getProgrammingLanguageById(languageID);
		mainFile = {
			name: languageInfo.source_file,
			icon: null,
			content: defaultJavaExecutionContext.main_code,
			canDelete: false,
			canRename: false,
			isReadOnly: false,
			isSelected: false
		};
		solutionFile = {
			name: languageInfo.solution_file,
			icon: null,
			content: defaultJavaExecutionContext.driver_code,
			canDelete: false,
			canRename: false,
			isReadOnly: true,
			isSelected: false
		};
		let additionalFiles: string = defaultJavaExecutionContext.additional_files;
		rootDirectory = await buildDirectoryStructure(mainFile, solutionFile, additionalFiles);
	});


</script>

{#if rootDirectory}
	<MultiFileView {rootDirectory} />
{/if}