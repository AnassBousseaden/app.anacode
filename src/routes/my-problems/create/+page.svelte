<script>

  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import ProblemCreator from '$lib/app/components/create/ProblemCreator.svelte';
  import * as Resizable from '$lib/components/ui/resizable';
  import HeaderSteps from '$lib/app/components/create/HeaderSteps.svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { localStorageJsonWritable, localStorageWritable } from '$lib/app/utils.js';
  import {
    PenLine,
    SquareCode,
    TestTubeDiagonal,
    CloudUpload, ChevronRight, FolderUp
  } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import Description from '$lib/app/components/prompt/Description.svelte';
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';
  import { writable } from 'svelte/store';
  import { z } from 'zod';
  import {
    step1Description,
    step2description,
    step3Description,
    step4Description
  } from '$lib/app/create/Content.js';
  import { createUserProblem, updateUserProblem } from '$lib/api/anacode/api.anacode.js';

  export let data;
  let { problemData, problemId } = data;

  let form = localStorageJsonWritable(`create-problems-template-${problemId}`,
    problemData
  );

  let descriptionFormErrors = {};


  let steps = [
    {
      name: 'Description',
      icon: PenLine,
      description: step1Description
    },
    {
      name: 'Driver Code',
      icon: SquareCode,
      description: step2description
    },
    {
      name: 'Test Code',
      icon: TestTubeDiagonal,
      description: step3Description
    },
    {
      name: 'Preview & Save',
      icon: CloudUpload,
      description: step4Description
    }
  ];


  let formDescriptionValidator = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
      errorMap: () => ({ message: 'Difficulty must be Easy, Medium, or Hard' })
    }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    examples: z.array(z.object({
      input: z.string().min(1, { message: 'Input cannot be empty' }),
      output: z.string().min(1, { message: 'Output cannot be empty' })
    })).min(1, { message: 'At least one example is required' })
  });


  let handleContinue = async () => {
    try {
      if ($currentStep === 1) {
        formDescriptionValidator.parse($form);
        descriptionFormErrors = {};
      }
      if ($currentStep === 4) {
        if (problemId === null) {
          await createUserProblem($form);
        } else {
          await updateUserProblem(problemId, $form);
        }
      }

      $currentStep++;
    } catch (err) {
      if (err instanceof z.ZodError) {
        descriptionFormErrors = err.flatten().fieldErrors;
      } else {
        alert('unable to update problem: ' + err.message);
      }
    }
  };
  let currentStep = writable(1);


</script>


<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] h-full gap-2">
	<Resizable.Pane defaultSize={40} className="overflow-auto max-w-xs"
									style="overflow: hidden;display: flex;flex-direction: column">

		<HeaderSteps
			bind:currentStep={$currentStep}
			steps={steps}
		/>

		<Separator class="mt-2" />

		<div class="mt-2">
			<Description
				description={steps[$currentStep-1].description}
			/>
		</div>


		<Separator class="mt-2" />

		<div class="flex flex-grow overflow-auto mt-2">
			{#if $currentStep === 1}
				<ProblemCreator
					bind:title={$form.title}
					bind:difficulty={$form.difficulty}
					bind:description={$form.description}
					bind:examples={$form.examples}
					bind:errors={descriptionFormErrors}
				/>
			{/if}
			{#if $currentStep === 2}

				<PromptContent
					bind:description={$form.description}
					bind:title={$form.title}
					bind:examples={$form.examples}
					bind:difficulty={$form.difficulty}
				/>
			{/if}
			{#if $currentStep === 3}
				<div class="flex flex-grow overflow-hidden">
					<Editor codeStore={$form.driver_code} />
				</div>
			{/if}
			{#if $currentStep === 4}

			{/if}

		</div>

		<Button
			on:click={handleContinue}
			class="relative flex flex-shrink-0 items-center"
		>
			{#if $currentStep === 4}
				<FolderUp
					class="h-5 w-5 mr-2"
				/>
				publish
			{:else }
				<ChevronRight
					class="h-5 w-5 mr-2"
				/>
				continue
			{/if}
		</Button>

	</Resizable.Pane>
	<Resizable.Handle withHandle />

	<Resizable.Pane defaultSize={60} className="overflow-auto" style="overflow: auto;display: flex">
		<div class="flex overflow-auto flex-col flex-1">
			{#if $currentStep === 1}
				<PromptContent
					bind:title={$form.title}
					bind:description={$form.description}
					bind:examples={$form.examples}
					bind:difficulty={$form.difficulty}
				/>
			{/if}
			{#if $currentStep === 2}
				<div class="flex flex-grow overflow-hidden">
					<Editor bind:codeStore={$form.driver_code} />
				</div>
			{/if}
			{#if $currentStep === 3}
				<div class="flex flex-grow overflow-hidden">
					<Editor bind:codeStore={$form.test_code} />
				</div>
			{/if}
			{#if $currentStep === 4}

				<Tabs.Root value="prompt" class="flex flex-col flex-grow shrink	min-h-0">
					<Tabs.List class="grid w-full grid-cols-3">
						<Tabs.Trigger value="prompt">Prompt-Preview</Tabs.Trigger>
						<Tabs.Trigger value="driver_code">Driver Code Preview</Tabs.Trigger>
						<Tabs.Trigger value="test_code">Test Code Preview</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="prompt" class="flex-grow overflow-auto">
						<div class="flex h-full overflow-hidden">
							<PromptContent
								description={$form.description}
								title={$form.title}
								examples={$form.examples}
								difficulty={$form.difficulty}
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content value="driver_code" class="flex-grow overflow-auto">
						<div class="h-full flex flex-grow overflow-hidden">
							<Editor codeStore={$form.driver_code} />
						</div>
					</Tabs.Content>

					<Tabs.Content value="test_code" class="flex-grow overflow-auto">
						<div class="h-full flex flex-grow overflow-hidden">
							<Editor codeStore={$form.test_code} />
						</div>
					</Tabs.Content>
				</Tabs.Root>
			{/if}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>


<style>
</style>
