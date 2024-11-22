<script>
	import { base } from '$app/paths';

	export let data;
	const { problems } = data;
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
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
			<Table.Header>
				<Table.Row>
					<Table.Head>Title</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each problems as { id, title }}
					<Table.Row>
						<Table.Cell>
							<a href="{base}/problems/{id}" class="font-medium">{title}</a>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>

<style>
</style>
