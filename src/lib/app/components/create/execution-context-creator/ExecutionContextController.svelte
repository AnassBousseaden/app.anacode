<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { writable } from 'svelte/store';
	import { SquareCode, TestTubeDiagonal } from 'lucide-svelte';
	import { stepDriverCodeText, stepTestCasesText } from '$lib/app/create/Content.js';
	import StepDescription from '$lib/app/components/create/StepDescription.svelte';
	import DriverCodeEditor from '$lib/app/components/create/execution-context-creator/DriverCodeEditor.svelte';
	import ExecutionContextForm from '$lib/app/components/create/ExecutionContextForm.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import type { Language, PrivateExecutionContext } from '$lib/api/anacode/models';
	import MultiFileView from '$lib/app/components/create/multi-file-editor/multi-file-view.svelte';
	import type {
		DirectoryExtractionResult
	} from '$lib/app/components/create/multi-file-editor/executionContext.file.manager';
	import {
		ExecutionContextFileManager,
		extractDirectoryStructure
	} from '$lib/app/components/create/multi-file-editor/executionContext.file.manager';

	import { toast } from 'svelte-sonner';

	export let languageInfo: Language;
	export let executionContext: PrivateExecutionContext;
	export let handleSubmit = (newContext: PrivateExecutionContext) => {
		console.log('handleSubmit', newContext);
	};

	// simple file manager for the execution context
	let executionContextFileManager = new ExecutionContextFileManager(executionContext, languageInfo);

	// handle submit
	async function handleSubmitInner() {
		try {
			loadingSubmit.set(true);

			const directoryToExtract = executionContextFileManager.rootDirectory;
			const mainFileName = languageInfo.source_file;
			const solutionFileName = languageInfo.solution_file;
			const directoryExtractionResult: DirectoryExtractionResult = await extractDirectoryStructure(
				directoryToExtract,
				mainFileName,
				solutionFileName
			);

			await new Promise(res => setTimeout(res, 2_000));

			const { data: validatedData, valid } = await validateForm({ update: true });
			if (!valid) {
				toast.error('Please fix the Configuration errors before submitting');
				return;
			}

			const executionContextOptions = {
				...executionContext,
				...validatedData,
				main_code: directoryExtractionResult.mainFile.content,
				driver_code: directoryExtractionResult.solutionFile.content,
				additional_files: directoryExtractionResult.additionalFilesBase64
			};

			handleSubmit(executionContextOptions);

			toast.success('Execution context updated successfully');
		} catch (e) {
			toast.error(`Unable to build Execution Context: ${e.message || 'An unexpected error occurred'}`);
		} finally {
			loadingSubmit.set(false);
		}
	}

	let currentStep = writable(1);
	let handleContinue = () => {
		currentStep.update((step) => step + 1);
	};
	let loadingSubmit = writable(false);
	let steps = [
		{
			name: 'Driver Code',
			icon: SquareCode,
			description: stepDriverCodeText
		},
		{
			name: 'Test Code',
			icon: TestTubeDiagonal,
			description: stepTestCasesText
		}
	];

	const executionContextValidator = z.object({
		compiler_options: z
			.string()
			.max(256, 'Compiler options too long')
			.nullable()
			.default(null),
		enable_network: z
			.boolean()
			.nullable()
			.default(false),
		wall_time_limit: z
			.number()
			.min(1, 'Time limit must be at least 1 second')
			.max(5, 'Time limit cannot exceed 5 seconds')
			.nullable()
			.default(null),
		stdin: z
			.string()
			.max(9_999, 'stdin too long')
			.nullable()
			.default(null)
	});

	let executionContextForm = superForm(
		{ enable_network: false, ...executionContext },
		{
			validators: zodClient(executionContextValidator),
			dataType: 'json',
			SPA: true
		}
	);

	const { form: formData, enhance, validateForm } = executionContextForm;

</script>


{#await executionContextFileManager.init()}
{:then _}
	<div class="w-[100%] h-[100%] flex flex-col">
		<StepDescription
			bind:currentStep={currentStep}
			handleContinue={handleContinue}
			loadingSubmit={loadingSubmit}
			handleSubmit={handleSubmitInner}
			steps={steps}
		>
			{#if $currentStep === 1}
				<DriverCodeEditor language={languageInfo}
													solutionFileWritable={executionContextFileManager.solutionFile}></DriverCodeEditor>
			{/if}
			{#if $currentStep === 2}

				<Tabs.Root value="test_code" class="flex flex-col flex-grow shrink min-h-0">
					<Tabs.List class="grid w-full grid-cols-3">
						<Tabs.Trigger value="test_code">Test Code</Tabs.Trigger>
						<Tabs.Trigger value="stdin">Standard Input</Tabs.Trigger>
						<Tabs.Trigger value="config">Configuration</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="test_code" class="flex-grow overflow-auto">
						<div class="h-full flex flex-grow overflow-hidden">
							<MultiFileView bind:rootDirectory={executionContextFileManager.rootDirectory} />
						</div>
					</Tabs.Content>

					<Tabs.Content value="stdin" class="flex-grow overflow-auto">
						<form method="POST" class="flex-grow flex flex-col h-full overflow-hidden p-0.5" use:enhance>
							<Form.Field class="resize-none flex flex-grow flex-col" form={executionContextForm} name="stdin">
								<Form.Control let:attrs>
								<Textarea
									{...attrs}
									placeholder="This content will be given to the program as standard input"
									bind:value={$formData.stdin}
									class="resize-none flex-grow"
								>
							</Textarea>
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</form>
					</Tabs.Content>

					<Tabs.Content value="config" class="flex-grow overflow-auto">
						<div class="flex h-full overflow-hidden">
							<ExecutionContextForm
								form={executionContextForm}
								languageInfo={languageInfo}
							/>
						</div>
					</Tabs.Content>
				</Tabs.Root>
			{/if}
		</StepDescription>
	</div>
{/await}
