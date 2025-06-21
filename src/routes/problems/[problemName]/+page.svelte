<script lang="ts">
	import type { LanguagePreview, Submission, UserSubmission } from '$lib/api/anacode/models.ts';
	import Editor from '$lib/app/components/editor/Editor.svelte';
	import Prompt from '$lib/app/components/prompt/Prompt.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import EditorHeader from '$lib/app/components/editor/EditorHeader.svelte';
	import {
		pollForResult,
		postToJudge,
		SubmissionStatus,
		getSubmissions, getSubmission
	} from '$lib/api/anacode/submissions.js';
	import ResultBlock from '$lib/app/components/result/ResultBlock.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import {
		localStorageWritable,
		languageIDtoMonacoLanguageName,
		fileNameToMonacoLanguageName
	} from '$lib/app/utils.js';
	import type { PublicProblem, SubmissionResult } from '$lib/api/anacode/models.ts';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { authStore } from '$lib/api/anacode/auth.js';
	import RestoreCodeStoreModal from '$lib/app/components/editor/RestoreCodeStoreModal.svelte';
	import {
		getProgrammingLanguageNameFromID,
		langIDToMonacoLanguageName,
		localStorageJsonWritable
	} from '$lib/app/utils.js';
	import { ClientStatus, SubmissionClient } from '$lib/api/anacode/submission.client';
	import { getUserProblemSubmissions } from '$lib/api/anacode/api.anacode';

	export let data;
	const { publicProblem }: { publicProblem: PublicProblem } = data;
	const { programmingLanguages }: { programmingLanguages: LanguagePreview[] } = data;


	let submissions = writable<Submission[]>([]);
	let pane;
	let editorRef;
	let openRestoreCodeStore: boolean = false;
	// fetched data
	const { id, title, description, examples, difficulty, execution_contexts } = publicProblem;
	const languagesName = execution_contexts.map(({ language_id }) => getProgrammingLanguageNameFromID(programmingLanguages, language_id));
	const languagesSelector = execution_contexts.map(({ language_id }) => {
		return {
			value: `${language_id}`, label: getProgrammingLanguageNameFromID(programmingLanguages, language_id)
		};
	});

	let currentLanguageID = localStorageJsonWritable(`preferred-language-id-${id}`, execution_contexts[0].language_id);
	// submission handling
	const submissionClient = new SubmissionClient({ problemId: id });
	const clientState = submissionClient.ClientState;

	async function tryGetSubmissions() {
		try {
			$submissions = await getUserProblemSubmissions(id);
		} catch (err) {
			toast.info('not able to fetch submissions: ' + err.message);
		}
	}

	authStore.subscribe((userData) => {
			if (userData.isAuthenticated) {
				tryGetSubmissions();
			} else {
				submissions.set([]);
			}
		}
	);

	onMount(async () => {
		if (!$authStore.isAuthenticated) {
			toast.info('Login to submit code');
			return;
		}
	});

	function getDriverCodeFromLanguageId(languageId: number): string {
		for (const { language_id, driver_code } of execution_contexts) {
			if (languageId === language_id) return driver_code;
		}
		return '';
	}

	let currentCodeStore = localStorageWritable(`problem-store-${id}-${$currentLanguageID}`, getDriverCodeFromLanguageId($currentLanguageID));
	let tabs = writable('prompt');

	function handleSubmit() {
		const userSubmission: UserSubmission = {
			typed_code: $currentCodeStore,
			language_id: $currentLanguageID
		};

		if (pane && pane.getSize() < 45) {
			pane.resize(45);
		}
		submissionClient.submit(userSubmission);
	}

	currentLanguageID.subscribe((languageId) => {
		currentCodeStore = localStorageWritable(`problem-store-${id}-${languageId}`, getDriverCodeFromLanguageId(languageId));
	});


	submissionClient.submissions.subscribe((newSubmissions: Submission[]) => {
		if (newSubmissions.length <= 0) {
			return;
		}
		submissions.update((oldSubmission: Submission[]) => {
			return [...newSubmissions, ...oldSubmission] as Submission[];
		});
		submissionClient.submissions.set([]);
	});

</script>


<RestoreCodeStoreModal
	handleConfirm={() => editorRef?.setEditorContent(getDriverCodeFromLanguageId($currentLanguageID))}
	bind:open={openRestoreCodeStore}
/>

<Resizable.PaneGroup autoSaveId="main" direction="horizontal"
										 class="max-w-[98%] max-h-full gap-2">

	<Resizable.Pane defaultSize={34} class="flex flex-grow shrink min-h-0 min-w-0"
									style="display: flex; overflow-x: auto">
		<div class="flex flex-grow flex-col shrink min-w-[400px] min-h-0">
			<Prompt bind:tabs={$tabs} {title} {description} {examples} {difficulty}
							languages={languagesName}
							submissions={submissions}
							programmingLanguages={programmingLanguages}
			/>
		</div>
	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<Resizable.Pane defaultSize={66}
									class="flex flex-grow shrink min-h-0"
									style="display: flex;overflow-x: auto">

		<div class="flex flex-grow flex-col shrink min-w-[400px] min-h-0">
			<Resizable.PaneGroup direction="vertical" class="gap-2 overflow-auto flex">

				<Resizable.Pane defaultSize={100} class="flex flex-col overflow-auto gap-2">
					<EditorHeader {handleSubmit}
												disabled={$clientState.ClientStatus === ClientStatus.Processing}
												restoreCodeStore={() => openRestoreCodeStore = true}
												languagesSelector={languagesSelector}
												bind:currentLanguageId={$currentLanguageID}

					/>
					<Editor bind:this={editorRef} bind:codeStore={$currentCodeStore}
									language={langIDToMonacoLanguageName($currentLanguageID)}
									changeRequest={currentLanguageID}
					/>
				</Resizable.Pane>

				<Resizable.Handle withHandle />

				<Resizable.Pane
					class="flex"
					bind:pane={pane} defaultSize={0}>
					<ResultBlock clientState={clientState} />
				</Resizable.Pane>

			</Resizable.PaneGroup>

		</div>
	</Resizable.Pane>

</Resizable.PaneGroup>