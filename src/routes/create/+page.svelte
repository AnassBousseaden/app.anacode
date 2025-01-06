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
    CloudUpload, ChevronRight
  } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import Description from '$lib/app/components/prompt/Description.svelte';
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';
  import { writable } from 'svelte/store';
  import { z } from 'zod';
  import { sample_driver_code, sample_test_code } from '$lib/app/create/description.js';


  let form = localStorageJsonWritable('create-problems-1', {
    title: '',
    difficulty: '',
    description: '',
    examples: [{ input: '', output: '' }],
    driver_code: sample_driver_code,
    test_code: sample_test_code
  });

  let descriptionFormErrors = {};

  /*
		let steps = [
			{ name: 'Description', icon: PenLine, description: 'Description of the step.' },
			{ name: 'Driver Code', icon: SquareCode, description: 'Driver code of the step.' },
			{ name: 'Test Code', icon: TestTubeDiagonal, description: 'Test Code of the step.' },
			{ name: 'Preview & Save', icon: CloudUpload, description: 'Preview & Save of the step.' }
		];
	*/
  let steps = [
    {
      name: 'Description',
      icon: PenLine,
      description: `In this step, you'll write your problem description.

- Start with a clear problem statement
- Explain input/output formats and data types
- List any constraints (e.g., time/space complexity, input ranges)
- Provide 2-3 examples with explanations
- Add any helpful hints or notes (optional)

A good description helps users understand exactly what they need to solve!`
    },
    {
      name: 'Driver Code',
      icon: SquareCode,
      description: `Here you'll create the starting code template for users.

- Set up the main function/class structure
- Define parameter types and return type
- Add any necessary imports or helper code
- Include comments to guide users

This code will be the starting point for everyone attempting your problem.`
    },
    {
      name: 'Test Code',
      icon: TestTubeDiagonal,
      description: `Now it's time to create test cases to validate solutions.

- Start with simple, basic test cases
- Add edge cases (empty inputs, boundary values, etc.)
- Include large test cases for performance testing
- Provide explanations for complex test cases

Good test cases help ensure users' solutions work correctly!`
    },
    {
      name: 'Preview & Save',
      icon: CloudUpload,
      description: `Final step! Review everything before publishing.

- Check your problem description for clarity
- Verify the driver code compiles correctly
- Run all test cases to confirm they work
- Make any final adjustments

Once you're satisfied, hit save to publish your problem!`
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


  let handleContinue = () => {
      try {
        if ($currentStep === 1) {
          formDescriptionValidator.parse($form);
          descriptionFormErrors = {};
        }

        $currentStep++;
      } catch (err) {
        if (err instanceof z.ZodError) {
          descriptionFormErrors = err.flatten().fieldErrors;
        }
      }
    }
  ;
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
					description={$form.description}
					title={$form.title}
					examples={$form.examples}
					difficulty={$form.difficulty}
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
			type="submit"
			class="relative flex flex-shrink-0 items-center gap-2 px-4 py-2 mt-2
         bg-primary text-primary-foreground
         rounded-md
         transition-all duration-300
         hover:bg-primary
         focus:outline-none
         focus:ring-2 focus:ring-primary-foreground
         active:scale-95"
		>
			<ChevronRight
				class="h-5 w-5
           transition-transform duration-300
           group-hover:translate-x-1"
			/>
			continue
		</Button>

	</Resizable.Pane>
	<Resizable.Handle withHandle />

	<Resizable.Pane defaultSize={60} className="overflow-auto" style="overflow: auto;display: flex">
		<div class="flex overflow-auto flex-col flex-1">
			{#if $currentStep === 1}
				<PromptContent
					title={$form.title}
					description={$form.description}
					examples={$form.examples}
					difficulty={$form.difficulty}
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
