<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Editor from '$lib/app/components/editor/Editor.svelte';
	import type { Language } from '$lib/api/anacode/models';
	import { langIDToMonacoLanguageName } from '$lib/app/utils';
	import type { Writable } from 'svelte/store';
	import type { File } from '$lib/app/components/create/multi-file-editor/file.manager';

	export let language: Language;
	export let solutionFileWritable: Writable<File>;
</script>

<div class="flex-grow flex flex-col h-full overflow-hidden">
	<div class="py-2 border-b flex items-center">
		<Badge variant="outline">{language.solution_file}</Badge>
	</div>
	<div class="flex-grow flex overflow-hidden">
		<Editor language={langIDToMonacoLanguageName(language.id)}
						bind:codeStore={$solutionFileWritable.content} />
	</div>
</div>
