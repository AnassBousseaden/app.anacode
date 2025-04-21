<script>
  import { writable } from 'svelte/store';
  import { CloudUpload, PenLine, SquareCode, TestTubeDiagonal } from 'lucide-svelte';
  import {
    stepDescriptionText,
    stepDriverCodeText,
    stepPreviewAndSaveText,
    stepTestCasesText
  } from '$lib/app/create/Content.js';
  import StepDescription from '$lib/app/components/create/StepDescription.svelte';

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
</script>


<StepDescription
	currentStep={currentStep}
	handleContinue={handleContinue}
	loadingSubmit={loadingSubmit}
	handleSubmit={handleSubmit}
	steps={steps}
>


</StepDescription>
