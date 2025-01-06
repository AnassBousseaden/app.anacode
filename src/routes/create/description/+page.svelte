<script>

	import ProblemCreator from '$lib/app/components/create/ProblemCreator.svelte';
	import Prompt from '$lib/app/components/prompt/Prompt.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import HeaderSteps from '$lib/app/components/create/HeaderSteps.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { localStorageJsonWritable } from '$lib/app/utils.js';
	import { CheckSquare, ChevronRight, Code, Eye, FileText } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';


	let form = localStorageJsonWritable('create-problems-1', {
		title: '',
		difficulty: '',
		description: '',
		examples: [{ input: '', output: '' }],
		driver_code: '# sample driver_code',
		test_code: '# sample test_code'
	});

	let steps = [
		{ name: 'Description', icon: FileText },
		{ name: 'Driver Code', icon: Code },
		{ name: 'Test Code', icon: CheckSquare },
		{ name: 'Preview & Save', icon: Eye }
	];

	let handleContinue = () => {

		console.log('form submitted: ', $form);
	};
	let currentStep = 1;


</script>


<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] h-full gap-2">
	<Resizable.Pane defaultSize={40} className="overflow-auto max-w-xs"
									style="overflow: hidden;display: flex;flex-direction: column">

		<HeaderSteps
			currentStep={currentStep}
			steps={steps}
		/>

		<Separator class="mt-2" />

		<p class="p-2 mt-2">{steps[currentStep - 1].name} </p>

		<Separator class="mt-2" />

		<div class="flex-grow overflow-auto mt-2">
			<ProblemCreator
				bind:title={$form.title}
				bind:difficulty={$form.difficulty}
				bind:description={$form.description}
				bind:examples={$form.examples}
				handleContinue={handleContinue}
			/>
		</div>

		<Button
			on:click={handleContinue}
			type="submit"
			class="relative flex items-center gap-2 px-4 py-2 mt-2
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
			<Prompt
				title={$form.title}
				description={$form.description}
				examples={$form.examples}
			/>
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>


<style>
</style>
