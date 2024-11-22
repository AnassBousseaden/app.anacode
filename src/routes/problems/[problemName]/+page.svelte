<script>
	import { writable } from 'svelte/store';
	import Editor from './Editor.svelte';
	import Prompt from './Prompt.svelte';
	import EditorHeader from './EditorHeader.svelte';
	import { pollForResult, postToJudge } from '$lib/api/anacode/submissions.js';
	import ResultBlock from './ResultBlock.svelte';
	import * as Resizable from '$lib/components/ui/resizable';

	/** @type {import('./$types').PageData} */
	export let data;


	const { id, title, description, examples, driver_code } = data;
	const codeStorageKey = `problem-store-${id}`;

	// code Store
	let codeStore = writable();
	let x = [];

	codeStore.set(
		localStorage.getItem(codeStorageKey) == null
			? driver_code
			: localStorage.getItem(codeStorageKey)
	);

	codeStore.subscribe((newCode) => {
		localStorage.setItem(codeStorageKey, newCode);
	});

	// status can be running,error,success (idle <=> error or success)
	let submission = {
		status: '',
		token: '',
		result: ''
	};

	// code submitting
	let handleSubmit = async () => {
		if (submission.status === 'running') return;
		try {
			console.log($codeStore);
			submission.status = 'running';
			submission.token = await postToJudge(id, $codeStore);
			console.log('received token:', submission.token);
			submission.result = await pollForResult(submission.token);
			console.log('reseived result :', submission.result);
			x = [...x, JSON.parse(JSON.stringify(submission))];
			console.log(x)
		} catch (err) {
			console.error('failed because: ', err);
			submission.status = 'error';
		} finally {
			if (submission.status === 'running') submission.status = 'success';
		}
	};
</script>


<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] h-full gap-2">
	<Resizable.Pane defaultSize={50} className="overflow-auto" style="overflow: auto;display: flex">
		<div class="environment-container-item">
			<Prompt {title} {description} {examples} {x} />
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
