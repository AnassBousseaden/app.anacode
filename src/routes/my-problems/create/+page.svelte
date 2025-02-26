<script>
  // --- Imports ---
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Resizable from '$lib/components/ui/resizable';
  import * as Collapsible from '$lib/components/ui/collapsible/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Button } from '$lib/components/ui/button/index.js';

  import ProblemCreator from '$lib/app/components/create/ProblemCreator.svelte';
  import HeaderSteps from '$lib/app/components/create/HeaderSteps.svelte';
  import Description from '$lib/app/components/prompt/Description.svelte';
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';

  import { languageMap, localStorageJsonWritable } from '$lib/app/utils.js';
  import { writable } from 'svelte/store';
  import { z } from 'zod';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';

  import {
    PenLine,
    SquareCode,
    TestTubeDiagonal,
    CloudUpload,
    ChevronRight,
    FolderUp,
    PartyPopper,
    Search,
    PenSquare,
    ChevronsUpDown,
    LoaderCircle
  } from 'lucide-svelte';

  import {
    stepDescriptionText,
    stepDriverCodeText,
    stepTestCasesText,
    stepPreviewAndSaveText
  } from '$lib/app/create/Content.js';

  import { createUserProblem, updateUserProblem } from '$lib/api/anacode/api.anacode.js';

  // --- Data & Stores ---
  export let data;
  let { problemData, problemId } = data;
  const storeKey = `create-problems-template-${problemId}`;
  let form = localStorageJsonWritable(storeKey, problemData);

  $form = problemData;

  const currentStep = writable(1);
  const showSuccessModal = writable(false);

  let loadingSubmit = false;
  let descriptionFormErrors = {};

  // --- Step Definitions ---
  const steps = [
    {
      name: 'Description',
      icon: PenLine,
      description: stepDescriptionText
    },
    {
      name: 'Driver Code',
      icon: SquareCode,
      description: stepDriverCodeText
    },
    {
      name: 'Test Code',
      icon: TestTubeDiagonal,
      description: stepTestCasesText
    },
    {
      name: 'Preview & Save',
      icon: CloudUpload,
      description: stepPreviewAndSaveText
    }
  ];

  // --- Validators ---
  const formDescriptionValidator = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
      errorMap: () => ({ message: 'Difficulty must be Easy, Medium, or Hard' })
    }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    examples: z.array(
      z.object({
        input: z.string().min(1, { message: 'Input cannot be empty' }),
        output: z.string().min(1, { message: 'Output cannot be empty' })
      })
    ).min(1, { message: 'At least one example is required' })
  });

  // --- Auto-Redirect Variables ---
  let redirectTimeout; // Timer handle
  let redirectToastId; // Store the toast ID

  // --- Handlers ---
  async function handleSubmit() {
    if (loadingSubmit) return;
    loadingSubmit = true;
    try {
      let newProblemId = problemId;
      if (problemId === null) {
        const result = await createUserProblem($form);
        if (!result?.id) {
          throw new Error('Failed to get problem ID from server');
        }
        // eslint-disable-next-line no-unused-vars
        newProblemId = result.id;
        problemId = result.id;
      } else {
        await updateUserProblem(problemId, $form);
      }
      showSuccessModal.set(true);
      form.clear();

      // Create the toast and assign to module-level variable
      redirectToastId = toast.loading('Redirecting to My Problems', {
        action: {
          label: 'Cancel',
          onClick: () => {
            clearTimeout(redirectTimeout);
            toast.dismiss(redirectToastId);
            redirectToastId = null;
            toast.success('Redirect canceled');
          }
        },
        duration: Infinity
      });

      // Start auto-redirect after 5000ms
      redirectTimeout = setTimeout(() => {
        toast.dismiss(redirectToastId);
        redirectToastId = null;
        goto(`/my-problems`);
      }, 5000);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      loadingSubmit = false;
    }
  }

  async function handleContinue() {
    try {
      if ($currentStep === 1) {
        formDescriptionValidator.parse($form);
        descriptionFormErrors = {};
      }
      $currentStep = $currentStep + 1;
    } catch (err) {
      if (err instanceof z.ZodError) {
        descriptionFormErrors = err.flatten().fieldErrors;
      } else {
        toast.error(err.message || 'An unexpected error occurred');
      }
    }
  }

  // Cancels the auto-redirect timer and dismisses the toast when a dialog option is selected.
  function handleDialogOption(url) {
    clearTimeout(redirectTimeout);
    if (redirectToastId) {
      toast.dismiss(redirectToastId);
      redirectToastId = null;
    }
    goto(url);
  }
</script>

<!-- Main Resizable Layout -->
<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] h-full gap-2">
	<!-- Left Pane: Steps, Instructions, and Input Components -->
	<Resizable.Pane
		defaultSize={40}
		className="overflow-auto max-w-xs"
		style="overflow: hidden; display: flex; flex-direction: column"
	>
		<HeaderSteps bind:currentStep={$currentStep} steps={steps} />
		<Separator class="mt-2" />

		<!-- Collapsible Step Description -->
		<div class="mt-2">
			<Collapsible.Root class="flex-grow space-y-2">
				<div class="flex items-center justify-between rounded-md border p-2">
					<Collapsible.Trigger asChild let:builder>
						<h4 class="text-sm font-semibold">
							{steps[$currentStep - 1].description?.title}
						</h4>
						<Button
							builders={[builder]}
							variant="ghost"
							size="sm"
							class="w-9 p-0 border-border text-primary"
						>
							<ChevronsUpDown class="h-4 w-4" />
							<span class="sr-only">Toggle</span>
						</Button>
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content class="space-y-2 text-sm border border-primary rounded-md p-2">
					{#if steps[$currentStep - 1].description?.description}
						{@html steps[$currentStep - 1].description?.description}
					{/if}
				</Collapsible.Content>
			</Collapsible.Root>
		</div>

		<Separator class="mt-2" />

		<!-- Input Component: Renders different forms based on current step -->
		<div class="flex flex-grow overflow-auto my-2">
			{#if $currentStep === 1}
				<ProblemCreator
					bind:title={$form.title}
					bind:difficulty={$form.difficulty}
					bind:description={$form.description}
					bind:examples={$form.examples}
					bind:errors={descriptionFormErrors}
					bind:language_id={$form.language_id}
				/>
			{:else if $currentStep === 2}
				<PromptContent
					bind:title={$form.title}
					bind:description={$form.description}
					bind:examples={$form.examples}
					bind:difficulty={$form.difficulty}
				/>
			{:else if $currentStep === 3}
				<div class="flex flex-grow overflow-hidden">
					<Editor language={languageMap[$form.language_id].monaco_editor_language_name} readOnly={true}
									codeStore={$form.driver_code} />
				</div>
			{/if}
		</div>

		<!-- Action Button -->
		{#if $currentStep === 4}
			<Button
				disabled={loadingSubmit}
				on:click={handleSubmit}
				class="relative flex flex-shrink-0 items-center"
			>
				{#if loadingSubmit}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{:else}
					<FolderUp class="h-5 w-5 mr-2" />
				{/if}
				Publish
			</Button>
		{:else}
			<Button on:click={handleContinue} class="relative flex flex-shrink-0 items-center">
				<ChevronRight class="h-5 w-5 mr-2" />
				Continue
			</Button>
		{/if}
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
				<PromptContent
					bind:title={$form.title}
					bind:description={$form.description}
					bind:examples={$form.examples}
					bind:difficulty={$form.difficulty}
					bind:language_name={languageMap[$form.language_id].language_name}
				/>
			{:else if $currentStep === 2}
				<div class="flex flex-grow overflow-hidden">
					<Editor language={languageMap[$form.language_id].monaco_editor_language_name}
									bind:codeStore={$form.driver_code} />
				</div>
			{:else if $currentStep === 3}
				<div class="flex flex-grow overflow-hidden">
					<Editor language={languageMap[$form.language_id].monaco_editor_language_name}
									bind:codeStore={$form.test_code} />
				</div>
			{:else if $currentStep === 4}
				<Tabs.Root value="prompt" class="flex flex-col flex-grow shrink min-h-0">
					<Tabs.List class="grid w-full grid-cols-3">
						<Tabs.Trigger value="prompt">Prompt-Preview</Tabs.Trigger>
						<Tabs.Trigger value="driver_code">Driver Code Preview</Tabs.Trigger>
						<Tabs.Trigger value="test_code">Test Code Preview</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="prompt" class="flex-grow overflow-auto">
						<div class="flex h-full overflow-hidden">
							<PromptContent
								title={$form.title}
								description={$form.description}
								examples={$form.examples}
								difficulty={$form.difficulty}
							/>
						</div>
					</Tabs.Content>

					<Tabs.Content value="driver_code" class="flex-grow overflow-auto">
						<div class="h-full flex flex-grow overflow-hidden">
							<Editor language={languageMap[$form.language_id].monaco_editor_language_name} readOnly={true}
											codeStore={$form.driver_code} />
						</div>
					</Tabs.Content>

					<Tabs.Content value="test_code" class="flex-grow overflow-auto">
						<div class="h-full flex flex-grow overflow-hidden">
							<Editor language={languageMap[$form.language_id].monaco_editor_language_name} readOnly={true}
											codeStore={$form.test_code} />
						</div>
					</Tabs.Content>
				</Tabs.Root>
			{/if}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<!-- Success Modal -->
<Dialog.Root
	bind:open={$showSuccessModal}
	closeOnOutsideClick={false}
	closeOnEscape={false}
>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>
        <span class="flex items-center gap-2">
          <PartyPopper size={20} /> Problem Published!
        </span>
			</Dialog.Title>
			<Dialog.Description>
				Your problem is now live. What would you like to do next?
			</Dialog.Description>
		</Dialog.Header>
		<Button on:click={() => handleDialogOption(`/my-problems`)}>
			<PenSquare size={16} class="mr-2" />
			Back To My Problems
		</Button>
		<Button on:click={() => handleDialogOption(`/problems/${problemId}`)}>
			<Search size={16} class="mr-2" />
			View Problem
		</Button>
	</Dialog.Content>
</Dialog.Root>
