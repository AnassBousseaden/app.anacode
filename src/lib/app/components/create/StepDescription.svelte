<script>
  import * as Collapsible from '$lib/components/ui/collapsible/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import {
    ChevronRight,
    ChevronsUpDown,
    CloudUpload, FolderUp,
    LoaderCircle,
    PenLine,
    SquareCode,
    TestTubeDiagonal
  } from 'lucide-svelte';
  import {
    stepDescriptionText,
    stepDriverCodeText,
    stepTestCasesText,
    stepPreviewAndSaveText
  } from '$lib/app/create/Content.js';
  import HeaderSteps from '$lib/app/components/create/HeaderSteps.svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { writable } from 'svelte/store';

  export let currentStep;
  export let handleContinue;
  export let loadingSubmit = writable(false);
  export let handleSubmit;
  export let steps = [
    {
      name: 'Description',
      icon: PenLine,
      description: stepDescriptionText
    },
    {
      name: 'Execution Context',
      icon: SquareCode,
      description: stepDriverCodeText
    },
    {
      name: 'Preview & Save',
      icon: CloudUpload,
      description: stepPreviewAndSaveText
    }
  ];


</script>

<HeaderSteps bind:currentStep={$currentStep} steps={steps} />
<Separator class="mt-2" />
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
<Separator class="my-2" />

<slot />

<Separator class="my-auto my-2" />
{#if $currentStep === steps.length}
	<Button
		disabled={$loadingSubmit}
		onclick={handleSubmit}
		class="relative flex flex-shrink-0 items-center"
	>
		{#if $loadingSubmit}
			<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
		{:else}
			<FolderUp class="h-5 w-5 mr-2" />
		{/if}
		Publish
	</Button>
{:else}
	<Button onclick={handleContinue} class="relative flex flex-shrink-0 items-center">
		<ChevronRight class="h-5 w-5 mr-2" />
		Continue
	</Button>
{/if}
