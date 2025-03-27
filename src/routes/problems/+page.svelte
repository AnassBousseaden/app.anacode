<script lang="ts">
	import { base } from '$app/paths';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { goto } from '$app/navigation';
	import { getProgrammingLanguageNameFromID } from '$lib/app/utils.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type {
		ProblemPreview,
		LanguagePreview
	} from '$lib/api/anacode/models';


	export let data;
	const { problems }: { problems: ProblemPreview[] } = data;
	const { programmingLanguages }: { programmingLanguages: LanguagePreview[] } = data;

</script>

<Card.Root class="flex flex-col items-stretch overflow-hidden w-2/3 xl:col-span-2">
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

	<Card.Content class="flex flex-col items-stretch overflow-auto">
		<Table.Root>
			<Table.Header class="bg-muted">
				<Table.Row>
					<Table.Head>Title</Table.Head>
					<Table.Head>Difficulty</Table.Head>
					<Table.Head>Languages</Table.Head>
					<Table.Head>Created</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each problems as { id, title, difficulty, language_ids, created_at }}
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
						<Table.Cell class="">
							{#each language_ids.slice(0, 2) as language_id }
								<Badge variant="secondary">
									{getProgrammingLanguageNameFromID(programmingLanguages, language_id)}
								</Badge>
							{/each}
							{#if language_ids.length > 2}
								<Badge variant="secondary">...</Badge>
							{/if}
						</Table.Cell>
						<Table.Cell>
							{new Date(created_at)?.toLocaleDateString()}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
