<script>
	export let handleSubmit;
	export let submission;
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<div class="bg-muted text-muted-foreground h-9 rounded-lg p-1 w-full"
		 style="display: flex; justify-content: space-between;">
	<Button variant="outline" class="h-full" on:click={handleSubmit}>Submit</Button>
	{#if submission.status}
		<Badge class="h-full">
			{submission.status}
		</Badge>
	{/if}
</div>
