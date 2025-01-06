<script>

	import { z } from 'zod';
	import Prompt from '$lib/app/components/prompt/Prompt.svelte';
	import { writable } from 'svelte/store';
	import Editor from '$lib/app/components/editor/Editor.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import HeaderSteps from '$lib/app/components/create/HeaderSteps.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { localStorageJsonWritable } from '$lib/app/utils.js';

	let formSchema = z.object({
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

	let form = localStorageJsonWritable('create', {
		title: '',
		difficulty: '',
		description: '',
		examples: [{ input: '', output: '' }]
	});

	let errors = {};

	let handleSubmit = () => {
		try {
			console.log('Form submitted:', $form);
			// Validate the entire form
			formSchema.parse($form);
			errors = {};
			// Handle successful submission
		} catch (err) {
			if (err instanceof z.ZodError) {
				errors = err.flatten().fieldErrors;
			}
		}
	};


	let codeStore = writable();


</script>


<Resizable.PaneGroup direction="horizontal" class="max-w-[98%] h-full gap-2">
	<Resizable.Pane defaultSize={40} className="overflow-auto max-w-xs" style="overflow: auto;display: flex">

		<div class="gap-2 flex flex-col overflow-auto flex-auto">
			<HeaderSteps
				currentStep=2
			/>

			<Separator />

			<div class="space-y-6 my-2">
				<p class="leading-7 [&:not(:first-child)]:mt-6">
					The <span class="font-semibold text-foreground">driver code</span> is the initial setup provided to users to
					help
					them test their solutions for a problem.
					It serves as a template that:
				</p>

				<ul class="ml-6 my-6 list-disc [&>li]:mt-2">
					<li class="leading-7">Calls the user-implemented function.</li>
					<li class="leading-7">Passes sample inputs to the function.</li>
					<li class="leading-7">Displays or verifies the function's output against expected results.</li>
				</ul>
			</div>
			<Separator />
			<div class="flex-grow">
				<Prompt
					description={$form.description}
					title={$form.title}
					examples={$form.examples}
				/>
			</div>
		</div>


	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={60} className="overflow-auto" style="overflow: auto;display: flex">
		<div class="environment-container-item">
			<Editor {codeStore} />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>


<style>
    .environment-container-item {
        flex: 1;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }
</style>
