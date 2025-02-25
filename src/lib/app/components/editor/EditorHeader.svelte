<script lang="js">
  import { LoaderCircle, SquareChevronRight } from 'lucide-svelte';

  export let handleSubmit;
  export let submissionStatus;
  export let detail = '';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { SubmissionStatus } from '$lib/api/anacode/submissions.js';

</script>

<div class="bg-muted text-muted-foreground h-9 rounded-lg p-1 w-full"
		 style="display: flex; justify-content: space-between;">
	<Button
		disabled={submissionStatus === SubmissionStatus.Running}
		class="h-full px-4 py-2 flex items-center gap-2 hover:bg-opacity-90 transition-all duration-200"
		on:click={handleSubmit}
	>
		{#if submissionStatus === SubmissionStatus.Running}
			<LoaderCircle class="mr-2 h-5 w-5 animate-spin" />
			Running
		{:else}
			Submit
			<SquareChevronRight class="w-5 h-5" />
		{/if}
	</Button>
	{#if submissionStatus}
		{#if submissionStatus == SubmissionStatus.Success }

		{/if}
		<Badge class="h-full">
			{submissionStatus}
			{#if detail}
				{`:${detail}`}
			{/if}
		</Badge>
	{/if}
</div>
