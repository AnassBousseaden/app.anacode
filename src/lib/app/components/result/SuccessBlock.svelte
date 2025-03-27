<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import {
		Clock,
		Loader2,
		CheckCircle,
		XCircle,
		Hourglass,
		Code,
		AlertTriangle,
		AlertCircle,
		Bug,
		FileX, ShieldQuestion
	} from 'lucide-svelte';
	import type { SubmissionResult } from '$lib/api/anacode/models';
	import { SubmissionStatus } from '$lib/api/anacode/models.js';

	export let submissionResult: SubmissionResult | null;
	export let props = {};
	const statusIcons: Record<SubmissionStatus, any> = {
		[SubmissionStatus.InQueue]: Clock,
		[SubmissionStatus.Processing]: Loader2,
		[SubmissionStatus.ExecutionSuccess]: CheckCircle,
		[SubmissionStatus.WrongAnswer]: XCircle,
		[SubmissionStatus.TimeLimitExceeded]: Hourglass,
		[SubmissionStatus.CompilationError]: Code,
		[SubmissionStatus.RuntimeErrorSIGSEGV]: AlertTriangle,
		[SubmissionStatus.RuntimeErrorSIGXFSZ]: AlertTriangle,
		[SubmissionStatus.RuntimeErrorSIGFPE]: AlertTriangle,
		[SubmissionStatus.RuntimeErrorSIGABRT]: AlertTriangle,
		[SubmissionStatus.RuntimeErrorNZEC]: AlertCircle,
		[SubmissionStatus.RuntimeErrorOther]: AlertCircle,
		[SubmissionStatus.InternalError]: Bug,
		[SubmissionStatus.ExecFormatError]: FileX
	};

	function getIcon(status: SubmissionStatus): any {
		return statusIcons[status] || ShieldQuestion;
	}

	// info;error;success

	$: hasProgramOutput = submissionResult?.stdout && submissionResult.stdout.trim().length > 0;
	$: hasCompileOutput = submissionResult?.compile_output && submissionResult.compile_output.trim().length > 0;
	$: hasResultOutput = submissionResult?.stderr && submissionResult.stderr.trim().length > 0;
</script>

{#if submissionResult !== null && submissionResult.status_id !== null }
	<Card.Root class="flex flex-col h-full w-full">
		<Card.Header>
			<Card.Title class="flex items-center">
				<svelte:component this={getIcon(submissionResult.status_id)} size={50} class="mr-3" />
				{submissionResult.status_message || 'Submission Result'}
			</Card.Title>
			<Separator />
			<Card.Description class="flex flex-col items-start">
				{#if submissionResult.time}
					<div>
						Time: {submissionResult.time} ms
					</div>
				{/if}
				{#if submissionResult.memory}
					<div>
						Memory: {submissionResult.memory} KB
					</div>
				{/if}

				{#if submissionResult.description}
					<div>
						{submissionResult.description}
					</div>
				{/if}
			</Card.Description>

			<Separator />
		</Card.Header>

		<Card.Content class="flex flex-grow flex-col shrink min-w-0 min-h-0 p-6 py-3">
			<Tabs.Root class="flex flex-col flex-grow overflow-hidden">
				<Tabs.List class="grid grid-flow-col grid-cols-[repeat(auto-fit,minmax(0px,1fr))]">
					{#if hasResultOutput}
						<Tabs.Trigger class="overflow-hidden" value="result">Result</Tabs.Trigger>
					{/if}
					{#if hasProgramOutput}
						<Tabs.Trigger class="overflow-hidden" value="program_output">Program Output</Tabs.Trigger>
					{/if}
					{#if hasCompileOutput}
						<Tabs.Trigger class="overflow-hidden" value="compile_output">Compile Output</Tabs.Trigger>
					{/if}
				</Tabs.List>
				{#if hasResultOutput}

					<Tabs.Content value="result" class="flex-grow overflow-hidden">
						<Card.Root class="flex flex-col h-full w-full p-3">
<pre
	class="h-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-800 p-4 text-wrap font-mono text-sm leading-relaxed border border-gray-200 dark:border-gray-700"
><code
	class="text-gray-800 dark:text-gray-200">{submissionResult.stderr.trim() || 'No result details available.'}</code></pre>
						</Card.Root>
					</Tabs.Content>
				{/if}

				{#if hasProgramOutput}
					<Tabs.Content value="program_output" class="flex-grow overflow-hidden">
						<Card.Root class="flex flex-col h-full w-full p-3">
								<pre
									class="h-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-800 p-4 text-wrap font-mono text-sm leading-relaxed border border-gray-200 dark:border-gray-700"
								><code>{submissionResult.stdout}</code></pre>
						</Card.Root>
					</Tabs.Content>
				{/if}

				{#if hasCompileOutput}
					<Tabs.Content value="compile_output" class="flex-grow overflow-hidden">
						<Card.Root class="flex flex-col h-full w-full p-3 ">
								<pre
									class="h-full overflow-auto rounded-md bg-gray-100 dark:bg-gray-800 p-4 text-wrap font-mono text-sm leading-relaxed border border-gray-200 dark:border-gray-700"
								><code>{submissionResult.compile_output}</code></pre>
						</Card.Root>
					</Tabs.Content>
				{/if}
			</Tabs.Root>
		</Card.Content>
	</Card.Root>
{/if}


<style></style>