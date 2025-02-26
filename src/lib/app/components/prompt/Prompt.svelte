<script>
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';
  import SubmissionPreview from '$lib/app/components/prompt/submission/SubmissionPreview.svelte';

  export let title;
  export let description;
  export let examples;
  export let difficulty;
  export let submissions;
  export let tabs;
  export let language_name;
</script>


<Tabs.Root bind:value={tabs} class="flex flex-col flex-grow overflow-hidden">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="prompt">Description</Tabs.Trigger>
		<Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="prompt" class="flex-grow overflow-hidden">
		<PromptContent
			title={title}
			description={description}
			examples={examples}
			difficulty={difficulty}
			language_name={language_name}
		/>
	</Tabs.Content>

	<Tabs.Content value="submissions" class="flex-grow overflow-hidden">

		<Card.Root class="card-root flex flex-col h-full w-full">
			<Card.Header class="card-header space-y-2">
				<Card.Title>Submissions</Card.Title>
				<Card.Description>
					Checkout your submissions here
					<Separator />
				</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col flex-grow overflow-auto">
				<ol class="flex flex-col flex-grow sticky">
					{#each submissions.reverse() as submission (submission.created_at)}
						<li id={submission.created_at} class="my-2">
							<SubmissionPreview
								submission={submission}
								submissionPreviewText={submission.status_message}
							/>
						</li>
					{/each}
				</ol>
			</Card.Content>
			<Card.Footer>
			</Card.Footer>
		</Card.Root>


	</Tabs.Content>
	<slot />
</Tabs.Root>

