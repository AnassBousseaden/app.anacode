<script>
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import ResultBlock from '$lib/app/components/result/ResultBlock.svelte';

	export let submissionPreviewText;
	export let submission;
</script>

<Collapsible.Root class="flex-grow space-y-2">
	<div class="flex items-center justify-between space-x-4 rounded-md border px-4 py-3">
		<Collapsible.Trigger asChild let:builder>
			<h4 class="text-sm font-semibold">{submissionPreviewText}</h4>
			<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0 border-border">
				<ChevronsUpDown class="h-4 w-4" />
				<span class="sr-only">Toggle</span>
			</Button>
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content class="space-y-2 border border-primary rounded-md p-2">

		<Tabs.Root value="status_message" class="flex flex-col flex-grow shrink min-w-0">
			<Tabs.List class="grid grid-cols-2">
				<Tabs.Trigger value="status_message">Result</Tabs.Trigger>
				<Tabs.Trigger value="typed_code">Code</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="status_message">
				<ResultBlock submission={submission.result}></ResultBlock>
			</Tabs.Content>
			<Tabs.Content value="typed_code">
				<ResultBlock submission={submission.typed_code.trim()}></ResultBlock>
			</Tabs.Content>
		</Tabs.Root>

	</Collapsible.Content>
</Collapsible.Root>
