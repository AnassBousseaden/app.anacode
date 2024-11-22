<script>
	import { writable } from 'svelte/store';
	import Editor from './Editor.svelte';
	import Prompt from './Prompt.svelte';
	import EditorHeader from './EditorHeader.svelte';
	import { pollForResult, postToJudge } from '$lib/submissions';
	import ResultBlock from './ResultBlock.svelte';
	import * as Resizable from '$lib/components/ui/resizable';

	/** @type {import('./$types').PageData} */
	export let data;


	const { id, title, description, examples, driver_code } = data;
	const codeStorageKey = `problem-store-${id}`;
	const initialCode =
		localStorage.getItem(codeStorageKey) == null
			? driver_code
			: localStorage.getItem(codeStorageKey);
	// code Storage
	let codeStore = writable();
	let currentCode = '';

	codeStore.set(initialCode);

	codeStore.subscribe((newCode) => {
		localStorage.setItem(codeStorageKey, newCode);
		currentCode = newCode;
	});

	// status can be running,error,success (idle <=> error or success)
	let submission = {
		status: '',
		token: '',
		result: ''
	};

	$: console.log(submission);


	// code submition
	let handleSubmit = async () => {
		if (submission.status === 'running') return;
		try {
			console.log(currentCode);
			submission.status = 'running';
			submission.token = await postToJudge(id, currentCode);
			console.log('received token:', submission.token);
			submission.result = await pollForResult(submission.token);
			console.log('reseived result :', submission.result);
		} catch (err) {
			console.error('failed because!', err);
			submission.status = 'error';
		} finally {
			if (submission.status === 'running') submission.status = 'success';
		}
	};
</script>


<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] h-full gap-2">
	<Resizable.Pane defaultSize={50} className="overflow-auto" style="overflow: auto;display: flex">
		<div class="environment-container-item">
			<Prompt {title} {description} {examples} />
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane className="overflow-auto" style="overflow: auto;display: flex">
		<Resizable.PaneGroup direction="vertical" class="gap-2" style="overflow: auto;display: flex">
			<Resizable.Pane class="gap-2" style="overflow: auto;display: flex;flex-direction: column">
				<EditorHeader {handleSubmit} {submission} />
				<Editor {codeStore} />
			</Resizable.Pane>
			<Resizable.Handle withHandle />
			<Resizable.Pane style="overflow: hidden; display: flex">
				<ResultBlock {submission} />
			</Resizable.Pane>
		</Resizable.PaneGroup>
	</Resizable.Pane>
</Resizable.PaneGroup>


<style>
    .environment-container-item {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }
</style>
