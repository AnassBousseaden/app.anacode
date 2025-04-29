<script>
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Resizable from '$lib/components/ui/resizable';
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';

  import {
    getProgrammingLanguageNameFromID, langIDToMonacoLanguageName
  } from '$lib/app/utils.js';
  import { writable } from 'svelte/store';

  import StepDescription from '$lib/app/components/create/StepDescription.svelte';
  import { onMount } from 'svelte';
  import ProblemDescriptionFormManager from '$lib/app/create/problemDescriptionFormManager.js';
  import SuccessCreateProblemModal from '$lib/app/components/create/SuccessCreateProblemModal.svelte';
  import ProblemCreatorV2 from '$lib/app/components/create/ProblemCreatorV2.svelte';
  import PromptContentListener from '$lib/app/components/prompt/PromptContentListener.svelte';
  import ExecutionContextController
    from '$lib/app/components/create/execution-context-creator/ExecutionContextController.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Code2, FolderPlus, Plus, XCircle } from 'lucide-svelte';
  import { get } from 'svelte/store';
  import ExecutionContextPreview
    from '$lib/app/components/create/execution-context-creator/ExecutionContextPreview.svelte';
  import { createUserProblem, getProgrammingLanguageById, updateUserProblem } from '$lib/api/anacode/api.anacode.ts';
  import { toast } from 'svelte-sonner';
  import EditorHeader from '$lib/app/components/editor/EditorHeader.svelte';
  import { PrivateExecutionsContextManager } from '$lib/app/create/ExecutionContextsManager.ts';
  import { goto } from '$app/navigation';
  // --- Data & Stores ---
  export let data;
  let { problemData, problemId, languages: programmingLanguages } = data;
  let { id: problemID, title, difficulty, description, examples } = problemData;
  const currentStep = writable(1);
  let problemContentManager = new ProblemDescriptionFormManager(
    title, difficulty, description, examples
  );
  const initialExecutionContext = problemData.execution_contexts;

  const execContextManager = new PrivateExecutionsContextManager(
    initialExecutionContext,
    programmingLanguages
  );

  let executionContexts = execContextManager.getPrivateExecutionContextsStore();
  let currentExecutionContext = execContextManager.getCurrentPrivateExecutionContextStore();
  let languageIds = execContextManager.getLanguageIds();

  async function handleContinue() {
    if ($currentStep === 1 && !await problemContentManager.isDescriptionValid()) {
      return;
    }
    if ($currentStep === 2 && !execContextManager.validatePrivateExecutionContexts()) {
      toast.error('Please add at least one execution context');
      return;
    }
    $currentStep++;

  }


  let isLoadingSubmit = writable(false);
  let showSuccessModal = writable(false);

  async function handleSubmit() {
    try {
      isLoadingSubmit.set(true);
      // assemble problem Data.
      const { validateForm } = problemContentManager.form;
      const { data: validatedPromptContent, valid } = await validateForm({ update: true });
      if (!valid) {
        toast.error('Please fill all required fields in the prompt');
        return;
      }
      const execution_contexts = execContextManager.getAllPrivateExecutionContexts();

      const userProblem = {
        ...validatedPromptContent,
        execution_contexts: execution_contexts
      };
      console.log('userProblem', userProblem);
      console.log('problemID', problemID);
      let privateProblemCreated;
      if (problemID) {
        privateProblemCreated = await updateUserProblem(problemID, userProblem);
      } else {
        privateProblemCreated = await createUserProblem(userProblem);
      }
      console.log('privateProblemCreated', privateProblemCreated);
      problemID = privateProblemCreated.id;
      toast.success('Problem created successfully [' + `${problemID}` + ']');
      showSuccessModal.set(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      isLoadingSubmit.set(false);
    }
  }

  async function performRedirect(destination) {
    await goto(destination);
  }


  let languagesSelector = [];
  let currentLanguageID = writable(null);

  let currentCodeStore = '';

  languageIds.subscribe((languageIds) => {
    languagesSelector = languageIds.map((language_id) => {
        return {
          value: `${language_id}`, label: getProgrammingLanguageNameFromID(programmingLanguages, language_id)
        };
      }
    );
    currentLanguageID.set(null);
    if (languageIds.length === 0) {
      return;
    }
    const anyID = languageIds.find(() => true);
    currentLanguageID.set(anyID);
    console.log('languageIds', languageIds);

  });

  currentLanguageID.subscribe((languageID) => {
    const currentExecutionContextWritable = get(executionContexts).get(languageID);
    const currentExecutionContext = get(currentExecutionContextWritable);
    if (currentExecutionContext) {
      currentCodeStore = currentExecutionContext.driver_code;
    }
  });


  let programmingLanguagesMapDetail;
  $: currentLanguageInfo =
    $currentExecutionContext && programmingLanguagesMapDetail
      ? programmingLanguagesMapDetail.get($currentExecutionContext.language_id)
      : null;

  const showProgrammingLanguages = writable(false);

  onMount(async () => {
    programmingLanguagesMapDetail = new Map(
      await Promise.all(
        programmingLanguages.map(async (language) => {
          const data = await getProgrammingLanguageById(language.id);
          return [language.id, data];
        })
      )
    );
  });

  async function chooseLanguage(language_id) {
    await execContextManager.addPrivateExecutionContext(language_id);
    $showProgrammingLanguages = false;
  }

</script>

<Resizable.PaneGroup direction="horizontal" class="max-w-[98%]  h-full gap-2">
	<Resizable.Pane
		defaultSize={40}
		style="overflow: auto; display: flex; flex-direction: column"
	>
		<div class="flex flex-col flex-1 overflow-auto min-w-[400px]">
			<StepDescription currentStep={currentStep}
											 handleContinue={handleContinue}
											 handleSubmit={handleSubmit}
											 loadingSubmit={isLoadingSubmit}
			>

				<div class="flex flex-col flex-grow overflow-auto my-2">
					{#if $currentStep === 1}
						<ProblemCreatorV2
							form={problemContentManager.form}
						/>
					{:else if $currentStep === 2}
						<!--					under construction -->
						<Card.Root class="card-root flex flex-col h-full w-full">
							<Card.Header class="space-y-2">
								<Card.Title>Execution Contexts</Card.Title>
							</Card.Header>
							<Card.Content class="flex flex-col flex-grow overflow-auto">
								<ol class="flex flex-col flex-grow sticky">
									{#each Array.from($executionContexts) as [languageID, executionContext] (languageID)}
										<li id={languageID} class="my-1">
											<ExecutionContextPreview
												executionContext={executionContext}
												programmingLanguages={programmingLanguages}
												isSelected={$currentExecutionContext && $currentExecutionContext.language_id === languageID}
												onSelect={() => execContextManager.selectPrivateExecutionContext(languageID)}
												onDelete={() => execContextManager.deletePrivateExecutionContext(languageID)} )
												}}
											/>
										</li>
									{/each}
								</ol>
							</Card.Content>
							<Card.Footer>
								<Button type="button" variant="outline" on:click={() => $showProgrammingLanguages = true} size="icon"
												class="ml-auto">
									<Plus class="h-5 w-5" />
								</Button>
							</Card.Footer>
						</Card.Root>

					{:else if $currentStep === 3}
						<!--					<Tabs.Root value="driver_code" class="flex flex-col flex-grow shrink min-h-0">-->
						<!--						<Tabs.List class="grid w-full grid-cols-2">-->
						<!--							<Tabs.Trigger value="driver_code">Driver Code Preview</Tabs.Trigger>-->
						<!--							<Tabs.Trigger value="exec_context_config">Execution Context Configuration</Tabs.Trigger>-->
						<!--						</Tabs.List>-->
						<!--						<Tabs.Content value="driver_code" class="flex-grow overflow-auto">-->
						<!--							<div class="flex-grow flex flex-col h-full overflow-hidden">-->
						<!--								<div class="py-2 border-b flex items-center">-->
						<!--								</div>-->
						<!--								<div class="flex-grow flex overflow-hidden">-->
						<!--								</div>-->
						<!--							</div>-->
						<!--						</Tabs.Content>-->
						<!--						<Tabs.Content value="exec_context_config" class="flex-grow overflow-auto">-->
						<!--							<div class="flex h-full overflow-hidden">-->
						<!--							</div>-->
						<!--						</Tabs.Content>-->
						<!--					</Tabs.Root>-->
					{/if}
				</div>
			</StepDescription>
		</div>

	</Resizable.Pane>

	<Resizable.Handle withHandle />

	<!-- Right Pane: Preview and Editor -->
	<Resizable.Pane
		defaultSize={60}
		className="overflow-auto"
		style="overflow: auto; display: flex"
	>
		<div class="flex flex-col flex-1 overflow-auto min-w-[400px]">
			{#if $currentStep === 1}
				<PromptContentListener
					titleWritable={problemContentManager.titleReadable}
					descriptionWritable={problemContentManager.descriptionReadable}
					examplesWritable={problemContentManager.examplesReadable}
					difficultyWritable={problemContentManager.difficultyReadable}
				/>
			{:else if $currentStep === 2}
				{#if $currentExecutionContext && currentLanguageInfo}
					{#key $currentExecutionContext.language_id}
						<ExecutionContextController
							languageInfo={currentLanguageInfo}
							executionContext={$currentExecutionContext}
							handleSubmit={(newExecContext) => execContextManager.updatePrivateExecutionContext(newExecContext)}
						/>
					{/key}
				{:else}
					<div class="flex flex-1 items-center justify-center">
						<Code2 class="w-full h-12 flex-grow text-primary" />
					</div>
				{/if}


			{:else if $currentStep === 3}
				<Tabs.Root value="prompt" class="flex flex-col flex-grow shrink min-h-0">
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="prompt">Prompt Preview</Tabs.Trigger>
						<Tabs.Trigger value="driver_code">Driver Code Preview</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="prompt" class="flex-grow overflow-auto">
						<div class="flex h-full overflow-hidden">
							<PromptContent
								title={problemContentManager.title}
								description={problemContentManager.description}
								examples={problemContentManager.examples}
								difficulty={problemContentManager.difficulty}
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content value="driver_code" class="flex-grow overflow-auto">
						{#if $currentLanguageID !== null}
							<div class="flex-grow flex flex-col h-full overflow-hidden gap-2">
								<EditorHeader handleSubmit={() => {}}
															disabled={true}
															animate={false}
															restoreCodeStore={() => {}}
															languagesSelector={languagesSelector}
															bind:currentLanguageId={$currentLanguageID}

								/>
								<Editor codeStore={currentCodeStore}
												readOnly={true}
												changeRequest={currentLanguageID}
												language={langIDToMonacoLanguageName($currentLanguageID)}
								/>
							</div>
						{/if}
					</Tabs.Content>

					<Tabs.Content value="test_code" class="flex-grow overflow-auto">
						<div class="h-full flex flex-grow overflow-hidden">
						</div>
					</Tabs.Content>
				</Tabs.Root>
			{/if}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<SuccessCreateProblemModal bind:showSuccessModal={showSuccessModal}
													 backToProblem={() => performRedirect('/my-problems') }
													 viewProblem={() => performRedirect(`/problems/${problemID}`)} />


<Dialog.Root
	bind:open={$showProgrammingLanguages}
>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>
        <span class="flex items-center gap-2">
            <FolderPlus size={20} /> New Execution Context
        </span>
			</Dialog.Title>
			<Dialog.Description>
				Choose a programming language for your new problem.
			</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col space-y-2 my-4">
			{#each programmingLanguages as { id, name }}
				<Button on:click={() => chooseLanguage(id)}>
					{name}
				</Button>
			{/each}
		</div>

	</Dialog.Content>
</Dialog.Root>
