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
  import { FolderPlus } from 'lucide-svelte';
  import { get } from 'svelte/store';
  import ExecutionContextPreview
    from '$lib/app/components/create/execution-context-creator/ExecutionContextPreview.svelte';
  import { createUserProblem, getProgrammingLanguageById, updateUserProblem } from '$lib/api/anacode/api.anacode.ts';
  import { getExecutionContextByLanguageId } from '$lib/api/anacode/api.anacode.ts';
  import { toast } from 'svelte-sonner';
  import EditorHeader from '$lib/app/components/editor/EditorHeader.svelte';
  import { PrivateExecutionsContextManager } from '$lib/app/create/ExecutionContextsManager.js';
  // --- Data & Stores ---
  export let data;
  let { problemData, problemId, languages: programmingLanguages } = data;
  const { id: problemID, title, difficulty, description, examples } = problemData;
  const currentStep = writable(1);
  let problemContentManager = new ProblemDescriptionFormManager(
    title, difficulty, description, examples
  );
  const initialExecutionContext = problemData.execution_contexts;


  async function handleContinue() {
    if ($currentStep === 1 && !await problemContentManager.isDescriptionValid()) {
      return;
    }
    if ($currentStep === 2 && $executionContexts.size === 0) {
      toast.error('Please add at least one execution context');
      return;
    }
    $currentStep++;
  }

  const execContextManager = new PrivateExecutionsContextManager(
    initialExecutionContext,
    programmingLanguages
  );

  $: currentLanguageId = execContextManager.getCurrentLanguageIdStore();
  $: executionContexts = execContextManager.getPrivateExecutionContextsStore();
  $: currentExecutionContext = execContextManager.getCurrentPrivateExecutionContextStore();


  let isLoadingSubmit = writable(false);

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
      const execution_contexts = Array.from($executionContexts.values()).map(ctx => get(ctx));

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
      toast.success('Problem created successfully');
    } catch (e) {
      toast.error(e.message);
    } finally {
      isLoadingSubmit.set(false);
    }
  }

  let executionContexts = writable(
    new Map(
      initialExecutionContext.map(ctx => [ctx.language_id, writable(ctx)])
    )
  );

  $: languagesSelector = [...$executionContexts.keys()].map(id => ({
    value: `${id}`,
    label: getProgrammingLanguageNameFromID(programmingLanguages, id)
  }));

  let currentLanguageId = writable(null);
  let currentCodeStore;

  currentLanguageId.subscribe((value) => {
    if (value === null) return;
    const executionCtx = get(executionContexts).get(value);
    if (executionCtx) {
      currentCodeStore = get(executionCtx).driver_code;
    }
  });

  executionContexts.subscribe((map) => {
    if (map.size > 0) {
      currentLanguageId.update(() => {
        if (map.size === 0) {
          return null;
        }
        return map.keys().next().value;
      });
    }
  });


  let programmingLanguagesMapDetail;
  let currentExecutionContext = writable(null);
  executionContexts.subscribe((map) => {

    if ($currentExecutionContext?.language_id && !map.has($currentExecutionContext.language_id)) {
      currentExecutionContext.set(null);
    }
  });
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
    try {
      const ctx = await getExecutionContextByLanguageId(language_id);
      executionContexts.update((map) => {
        map.set(language_id, writable(ctx));
        return map;
      });
      showProgrammingLanguages.set(false);
    } catch (err) {
      toast.error(`Failed to load template: ${err.message}`);
    }
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
											onSelect={() => {
                        const ctx = get($executionContexts.get(languageID));
                        currentExecutionContext.set(ctx);
                      	console.log("ctx",ctx);
                      }}
											onDelete={() => {
                        executionContexts.update((map) => {
                          map.delete(languageID);
                         return map;
												})
											}}
										/>
									</li>
								{/each}
							</ol>
						</Card.Content>
						<Card.Footer>
							<Button on:click={() => $showProgrammingLanguages = true} size="sm" class="gap-1">
								<FolderPlus class="h-4 w-4" />
								New Execution Context
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
				/>
			{:else if $currentStep === 2}
				{#if $currentExecutionContext && currentLanguageInfo}
					{#key $currentExecutionContext.language_id}
						<ExecutionContextController
							languageInfo={currentLanguageInfo}
							executionContext={$currentExecutionContext}
							handleSubmit={(UpdatedExecutionContext) => {
                executionContexts.update((map) => {
                  map.set(UpdatedExecutionContext.language_id, writable(UpdatedExecutionContext));
                  return map;
                });
                currentExecutionContext.set(null);
							}}
						/>
					{/key}
				{:else}
					<!--	nothing to show message TODO-->

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
						{#if $currentLanguageId !== null}
							<div class="flex-grow flex flex-col h-full overflow-hidden gap-2">
								<EditorHeader handleSubmit={() => {}}
															disabled={true}
															animate={false}
															restoreCodeStore={() => {}}
															languagesSelector={languagesSelector}
															bind:currentLanguageId={$currentLanguageId}

								/>
								<Editor codeStore={currentCodeStore}
												readOnly={true}
												changeRequest={currentLanguageId}
												language={langIDToMonacoLanguageName($currentLanguageId)}
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

<!--<SuccessCreateProblemModal showSuccessModal={problemContentManager.showSuccessModalWritable}-->
<!--													 backToProblem={() => problemContentManager.backToProblem() }-->
<!--													 viewProblem={() => problemContentManager.viewProblem()} />-->


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
