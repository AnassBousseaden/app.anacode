<script>
  import { base } from '$app/paths';
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { goto } from '$app/navigation';
  import { languageMap } from '$lib/app/utils.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';


  export let data;
  const { problems } = data;
</script>

<Card.Root class="xl:col-span-2 w-2/3">
	<Card.Header class="flex flex-row items-center">
		<div class="grid gap-2">
			<Card.Title>Programming Problems</Card.Title>
			<Card.Description>Select a problem and start coding</Card.Description>
		</div>
		<Button href="https://leetcode.com/" size="sm" class="ml-auto gap-1">
			LeetCode
			<ArrowUpRight class="h-4 w-4" />
		</Button>
	</Card.Header>

	<Card.Content>
		<Table.Root>
			<Table.Header class="bg-muted">
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head>Difficulty</Table.Head>
					<Table.Head>Language</Table.Head>
					<Table.Head>Last Updated</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each problems as { id, title, difficulty, language_id, updated_at }}
					<Table.Row
						on:click={() => goto(`${base}/problems/${id}`)}
						class="cursor-pointer hover:bg-accent transition-colors"
					>
						<Table.Cell>{title}</Table.Cell>

						<Table.Cell>
							<Badge>
								{difficulty}
							</Badge>
						</Table.Cell>

						<Table.Cell>
							<Badge variant="secondary">
								{languageMap[language_id].language_name || "Unknown"}
							</Badge>
						</Table.Cell>

						<Table.Cell>
							{new Date(updated_at).toLocaleDateString()}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
