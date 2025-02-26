<script>
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
  import { localStorageWritable, languageMap } from '$lib/app/utils.js';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import SubmissionPreview from '$lib/app/components/prompt/submission/SubmissionPreview.svelte';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { authStore } from '$lib/api/anacode/auth.js';

  /** @type {import('./$types').PageData} */
  export let data;
  let submissions = writable([]);
  let pane;
  let mainPaneGroupApi;

  const { id, title, description, examples, driver_code, difficulty, language_id } = data;
  console.log(languageMap[language_id].monaco_editor_language_name);


  // ----- fetch submissions handling
  async function tryGetSubmissions() {
    try {
      $submissions = await getSubmissions(id);
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
    await tryGetSubmissions();
  });

  // code Store
  let codeStore = localStorageWritable(`problem-store-${id}`, driver_code);

  // status can be running,error,success (idle <=> error or success)

  let submission = writable({
    status: SubmissionStatus.Idle,
    token: '',
    result: {}
  });

  // code submitting
  let handleSubmit = async () => {
    if ($submission.status === SubmissionStatus.Running) return;
    try {
      $submission.result = {};
      $submission.token = '';

      $submission.status = SubmissionStatus.Running;
      $submission.token = await postToJudge(id, $codeStore);
      $submission.result = await pollForResult($submission.token);

    } catch (err) {
      $submission.status = SubmissionStatus.Error;
      $submission.result = {};
      submission.token = '';

      toast.error(err.message);
    } finally {
      if ($submission.status === SubmissionStatus.Running) {
        $submission.status = SubmissionStatus.Success;
        toast.info(SubmissionStatus.Success, {
          duration: Infinity,
          class: 'border'
        });
        let submissionResult = await getSubmission(id, $submission.token);
        $submissions = [...$submissions, submissionResult];
        pane.resize(Math.max(33, pane.getSize()));
        $tabs = 'submissions';
      }
    }
  };
  let tabs = writable('prompt');


</script>


<Resizable.PaneGroup bind:PaneGroupAPI={mainPaneGroupApi} autoSaveId="main" direction="horizontal"
										 class="max-w-[98%] max-h-full gap-2">

	<Resizable.Pane defaultSize={34} className="flex flex-grow shrink min-h-0 min-w-0"
									style="display: flex; overflow-x: auto">
		<div class="flex flex-grow flex-col shrink min-w-[400px] min-h-0">
			<Prompt bind:tabs={$tabs} {title} {description} {examples} {difficulty}
							language_name={languageMap[language_id].language_name} submissions={$submissions.reverse()} />
		</div>
	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<Resizable.Pane defaultSize={66}
									className="overflow-auto flex flex-grow shrink min-h-0"
									style="display: flex;overflow-x: auto">

		<div class="flex flex-grow flex-col shrink min-w-[400px] min-h-0">
			<Resizable.PaneGroup direction="vertical" class="gap-2 overflow-auto flex">

				<Resizable.Pane defaultSize={100} class="flex flex-col overflow-auto gap-2">
					<EditorHeader {handleSubmit} submissionStatus={$submission.status}
												detail={$submission.result.status_message} />
					<Editor bind:codeStore={$codeStore} language={languageMap[language_id].monaco_editor_language_name} />
				</Resizable.Pane>

				<Resizable.Handle withHandle />

				<Resizable.Pane bind:pane={pane} defaultSize={0} class="overflow-hidden flex">
					<ResultBlock collapse={() => pane.resize(0)}
											 stderr={$submission.result.stderr}
											 compilationOutput={$submission.result.compile_output}
											 stdout={$submission.result.stdout}
											 statusMessage={$submission.result.status_message} />
				</Resizable.Pane>

			</Resizable.PaneGroup>

		</div>
	</Resizable.Pane>

</Resizable.PaneGroup>
