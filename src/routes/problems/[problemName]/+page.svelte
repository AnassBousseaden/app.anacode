<script>
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import Prompt from '$lib/app/components/prompt/Prompt.svelte';
  import EditorHeader from '$lib/app/components/editor/EditorHeader.svelte';
  import {
    pollForResult,
    postToJudge,
    TimeOut,
    JudgeError,
    SubmissionStatus,
    getSubmissions, getSubmission
  } from '$lib/api/anacode/submissions.js';
  import ResultBlock from '$lib/app/components/result/ResultBlock.svelte';
  import * as Resizable from '$lib/components/ui/resizable';
  import { localStorageWritable } from '$lib/app/utils.js';
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  /** @type {import('./$types').PageData} */
  export let data;
  let submissions = writable([]);

  const { id, title, description, examples, driver_code, difficulty } = data;

  onMount(async () => {
    try {
      $submissions = await getSubmissions(id);
      console.log($submissions);
    } catch (e) {
      console.log('unable to get submissions');
    }
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
      if (err instanceof TimeOut) {
        $submission.status = SubmissionStatus.Timeout;
        $submission.result = {};
      }
    } finally {
      if ($submission.status === SubmissionStatus.Running) {
        $submission.status = SubmissionStatus.Success;
        let submissionResult = await getSubmission(id, $submission.token);
        $submissions = [...$submissions, submissionResult];
        console.log($submissions);
      }
    }
  };
</script>


<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] max-h-full gap-2">

	<Resizable.Pane defaultSize={34} className="flex flex-grow shrink min-h-0 min-w-0"
									style="display: flex; overflow-x: auto">
		<div class="flex flex-grow flex-col shrink min-w-[400px] min-h-0">
			<Prompt {title} {description} {examples} {difficulty} submissions={$submissions.reverse()} />
		</div>
	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<Resizable.Pane defaultSize={66}
									className="overflow-auto flex flex-grow shrink min-h-0"
									style="display: flex;overflow-x: auto">

		<div class="flex flex-grow flex-col shrink min-w-[400px] min-h-0">
			<Resizable.PaneGroup direction="vertical" class="gap-2 overflow-auto flex">

				<Resizable.Pane defaultSize={75} class="flex flex-col overflow-auto gap-2">
					<EditorHeader {handleSubmit} submissionStatus={$submission.status}
												detail={$submission.result.status_message} />
					<Editor bind:codeStore={$codeStore} />
				</Resizable.Pane>

				<Resizable.Handle withHandle />

				<Resizable.Pane defaultSize={25} class="overflow-hidden flex">
					<ResultBlock submission={$submission.result.stderr} />
				</Resizable.Pane>

			</Resizable.PaneGroup>

		</div>
	</Resizable.Pane>

</Resizable.PaneGroup>
