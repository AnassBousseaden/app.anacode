<script>
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
  import * as Collapsible from '$lib/components/ui/collapsible/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import SuccessBlock from '$lib/app/components/result/SuccessBlock.svelte';
  import {
    getProgrammingLanguageNameFromID,
    langIDToMonacoLanguageName,
  } from '$lib/app/utils.js';
  import { Badge } from '$lib/components/ui/badge/index.js';

  export let submissionPreviewText;
  export let submission;
  export let programmingLanguages;
</script>

<Collapsible.Root class="flex-grow space-y-2">
	<div class="flex items-center justify-between space-x-4 rounded-md border px-4 py-3">
		<Collapsible.Trigger asChild let:builder>
			<div class="space-y-1">
				<h1 class="text-sm font-semibold">
					{submissionPreviewText}
				</h1>
				<p class="text-xs italic text-muted-foreground">
					{new Date(submission.created_at).toLocaleString()}
				</p>
				<Badge variant="secondary">{getProgrammingLanguageNameFromID(programmingLanguages,submission.language_id)}</Badge>
			</div>
			<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0 border-border">
				<ChevronsUpDown class="h-4 w-4" />
				<span class="sr-only">Toggle</span>
			</Button>
		</Collapsible.Trigger>
	</div>
	<Collapsible.Content
		class="space-y-2 border border-primary rounded-md p-2 flex flex-col h-[66vh] overflow-y-hidden">
		<Tabs.Root value="status_message" class="flex flex-col flex-1 min-h-0 p58">
			<Tabs.List class="grid grid-cols-2">
				<Tabs.Trigger value="status_message">Result</Tabs.Trigger>
				<Tabs.Trigger value="typed_code">Code</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content class="min-h-0 flex-1 overflow-auto" value="status_message">
				<SuccessBlock submissionResult={submission} />
			</Tabs.Content>
			<Tabs.Content class="min-h-0 flex-1 overflow-auto" value="typed_code">
				<div class="flex h-full ">
					<Editor
						wordWrap={'off'}
						readOnly={true}
						language={langIDToMonacoLanguageName(submission.language_id)}
						codeStore={submission.typed_code.trim()}
					/>
				</div>
			</Tabs.Content>
		</Tabs.Root>

	</Collapsible.Content>
</Collapsible.Root>
