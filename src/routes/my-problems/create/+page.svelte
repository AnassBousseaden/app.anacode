<script>
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Resizable from '$lib/components/ui/resizable';
  import ProblemCreator from '$lib/app/components/create/ProblemCreator.svelte';
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';

  import {
    fileNameToMonacoLanguageName
  } from '$lib/app/utils.js';
  import { writable } from 'svelte/store';

  import StepDescription from '$lib/app/components/create/StepDescription.svelte';
  import MultiFileEditor from '$lib/app/components/create/MultiFileEditor.svelte';
  import FileManager from '$lib/app/create/fileManager.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { onMount } from 'svelte';
  import ProblemFormStore from '$lib/app/create/problemFormStore.js';
  import SuccessCreateProblemModal from '$lib/app/components/create/SuccessCreateProblemModal.svelte';
  import ProblemCreatorV2 from '$lib/app/components/create/ProblemCreatorV2.svelte';
  import PromptContentListener from '$lib/app/components/prompt/PromptContentListener.svelte';
  import ExecutionContextForm from '$lib/app/components/create/ExecutionContextForm.svelte';


  // --- Data & Stores ---
  export let data;
  let { problemData, problemId, languageInfo } = data;
  const currentStep = writable(3);
  let fileManager = new FileManager(languageInfo, problemData);
  let problemContentManager = new ProblemFormStore(
    problemId, problemData.title, problemData.difficulty, problemData.description, problemData.examples, languageInfo.id
  );

  onMount(() => {
    fileManager.init();
  });


  async function handleContinue() {
    if ($currentStep === 1 && !await problemContentManager.isDescriptionValid()) {
      return;
    }
    if ($currentStep === 3 && !await problemContentManager.isExecutionContextFormValid()) {
      return;
    }

    $currentStep++;
  }

</script>

<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] h-full gap-2">
	<Resizable.Pane
		defaultSize={40}
		className="overflow-auto max-w-xs"
		style="overflow: hidden; display: flex; flex-direction: column"
	>
		<StepDescription currentStep={currentStep}
										 handleContinue={handleContinue}
										 handleSubmit={() => problemContentManager.handleSubmit(fileManager)}
										 loadingSubmit={problemContentManager.LoadingWritable}
		>
			<div class="flex flex-col flex-grow overflow-auto my-2">
				{#if $currentStep === 1}
					<ProblemCreatorV2
						form={problemContentManager.form}
					/>
				{:else if $currentStep === 2}
					<PromptContent
						bind:title={problemContentManager.title}
						bind:description={problemContentManager.description}
						bind:examples={problemContentManager.examples}
						bind:difficulty={problemContentManager.difficulty}
						language_name={languageInfo.name}
					/>
				{:else if $currentStep === 3}
					<Tabs.Root value="driver_code" class="flex flex-col flex-grow shrink min-h-0">
						<Tabs.List class="grid w-full grid-cols-2">
							<Tabs.Trigger value="driver_code">Driver Code Preview</Tabs.Trigger>
							<Tabs.Trigger value="exec_context_config">Execution Context Configuration</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content value="driver_code" class="flex-grow overflow-auto">
							<div class="flex-grow flex flex-col h-full overflow-hidden">
								<div class="py-2 border-b flex items-center">
									<Badge variant="outline">{languageInfo.solution_file}</Badge>
								</div>
								<div class="flex-grow flex overflow-hidden">
									<Editor language={fileNameToMonacoLanguageName(languageInfo.solution_file)}
													readOnly={true}
													codeStore={fileManager.solutionCode} />
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="exec_context_config" class="flex-grow overflow-auto">
							<div class="flex h-full overflow-hidden">
								<ExecutionContextForm
									form={problemContentManager.executionContextForm}
									languageInfo={languageInfo}
								/>
							</div>
						</Tabs.Content>
					</Tabs.Root>


				{/if}
			</div>
		</StepDescription>

	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<!-- Right Pane: Preview and Editor -->
	<Resizable.Pane
		defaultSize={60}
		className="overflow-auto"
		style="overflow: auto; display: flex"
	>
		<div class="flex flex-col flex-1 overflow-auto">
			{#if $currentStep === 1}
				<PromptContentListener
					titleWritable={problemContentManager.titleReadable}
					descriptionWritable={problemContentManager.descriptionReadable}
					examplesWritable={problemContentManager.examplesReadable}
					difficultyWritable={problemContentManager.difficultyReadable}
					language_name={languageInfo.name}
				/>
			{:else if $currentStep === 2}
				<div class="flex-grow flex flex-col h-full overflow-hidden">
					<div class="py-2 border-b flex items-center">
						<Badge variant="outline">{languageInfo.solution_file}</Badge>
					</div>
					<div class="flex-grow flex overflow-hidden">
						<Editor language={fileNameToMonacoLanguageName(languageInfo.solution_file)}
										bind:codeStore={fileManager.solutionCode} />
					</div>
				</div>
			{:else if $currentStep === 3}

				<MultiFileEditor fileList={fileManager.store}
												 addFile={fileManager.addFile.bind(fileManager)}
												 deleteFile={fileManager.deleteFile.bind(fileManager)}
												 editFileName={fileManager.editFileName.bind(fileManager)}
				/>

			{:else if $currentStep === 4}
				<Tabs.Root value="prompt" class="flex flex-col flex-grow shrink min-h-0">
					<Tabs.List class="grid w-full grid-cols-3">
						<Tabs.Trigger value="prompt">Prompt Preview</Tabs.Trigger>
						<Tabs.Trigger value="driver_code">Driver Code Preview</Tabs.Trigger>
						<Tabs.Trigger value="test_code">Test Code Preview</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="prompt" class="flex-grow overflow-auto">
						<div class="flex h-full overflow-hidden">
							<PromptContent
								title={problemContentManager.title}
								description={problemContentManager.description}
								examples={problemContentManager.examples}
								difficulty={problemContentManager.difficulty}
								language_name={languageInfo.name}
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content value="driver_code" class="flex-grow overflow-auto">
						<div class="flex-grow flex flex-col h-full overflow-hidden">
							<div class="flex-grow flex overflow-hidden">
								<Editor language={fileNameToMonacoLanguageName(languageInfo.solution_file)}
												readOnly={true}
												codeStore={fileManager.solutionCode} />
							</div>
						</div>
					</Tabs.Content>

					<Tabs.Content value="test_code" class="flex-grow overflow-auto">
						<div class="h-full flex flex-grow overflow-hidden">
							<MultiFileEditor readOnly={true} fileList={fileManager.store} />
						</div>
					</Tabs.Content>
				</Tabs.Root>
			{/if}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<SuccessCreateProblemModal showSuccessModal={problemContentManager.showSuccessModalWritable}
													 backToProblem={() => problemContentManager.backToProblem() }
													 viewProblem={() => problemContentManager.viewProblem()} />