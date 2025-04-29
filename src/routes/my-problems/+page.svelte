<script>
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { FolderPlus, PencilLine, Trash2 } from 'lucide-svelte';
  import { base } from '$app/paths';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import NoProblems from '$lib/app/components/create/NoProblems.svelte';
  import { getProgrammingLanguageNameFromID, jsonToQueryParams } from '$lib/app/utils.js';
  import { deleteUserProblem } from '$lib/api/anacode/api.anacode.ts';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';

  export let data;
  $: ({ problems, programmingLanguages } = data);


  async function deleteProblem(problem_id) {
    try {
      await deleteUserProblem(problem_id);
      const filtered = problems.filter(problem => problem.id !== problem_id);
      data = { ...data, problems: filtered };
      toast.success(`problem [${problem_id}] deleted`);
    } catch (err) {
      toast.error(err.message);
    }
  }

</script>
{#if problems}
	<Card.Root class="flex flex-col items-stretch overflow-hidden xl:col-span-1 w-2/3">
		<Card.Header class="flex flex-row items-center">
			<div class="grid gap-2">
				<Card.Title>Your Programming Problems</Card.Title>
				<Card.Description>Manage your created problems</Card.Description>
			</div>
			<Button on:click={() => goto(`/my-problems/create`)} size="sm" class="ml-auto gap-1">
				<FolderPlus class="h-4 w-4" />
				New Problem
			</Button>
		</Card.Header>

		<Card.Content class="flex flex-col items-stretch overflow-auto">
			{#if problems.length > 0}
				<Table.Root class="w-full">
					<Table.Header>
						<Table.Row class="bg-muted">
							<Table.Head>Title</Table.Head>
							<!--							<Table.Head>ID</Table.Head>-->
							<Table.Head>Difficulty</Table.Head>
							<Table.Head>Language</Table.Head>
							<Table.Head>Last Update</Table.Head>
							<Table.Head>Action</Table.Head>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{#each problems as { id, title, difficulty, updated_at, language_ids }}
							<Table.Row class="hover:bg-accent transition">
								<Table.Cell class="truncate max-w-xs">
									<a href="{base}/problems/{id}" class="font-medium text-primary hover:underline">
										{title}
									</a>
								</Table.Cell>
								<!--								<Table.Cell>{id}</Table.Cell>-->
								<Table.Cell>
									<Badge>{difficulty}</Badge>
								</Table.Cell>
								<Table.Cell class="">
									{#each language_ids?.slice(0, 2) as language_id }
										<Badge variant="secondary">
											{getProgrammingLanguageNameFromID(programmingLanguages, language_id)}
										</Badge>
									{/each}
									{#if language_ids?.length > 2}
										<Badge variant="secondary">...</Badge>
									{/if}
								</Table.Cell>
								<Table.Cell>{new Date(updated_at).toLocaleString()}</Table.Cell>
								<Table.Cell class="text-nowrap">
									<Button variant="outline" href={`/my-problems/create?${jsonToQueryParams({ problem_id: id })}`}
													size="icon">
										<PencilLine class="w-4 h-4" />
									</Button>
									<AlertDialog.Root>
										<AlertDialog.Trigger asChild let:builder>
											<Button builders={[builder]} variant="destructive" size="icon">
												<Trash2 class="w-4 h-4" />
											</Button>
										</AlertDialog.Trigger>
										<AlertDialog.Content class="text-nowrap">
											<AlertDialog.Header>
												<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
												<AlertDialog.Description>
													This action cannot be undone. This will permanently delete the problem.
												</AlertDialog.Description>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
												<AlertDialog.Action on:click={() => deleteProblem(id)}>
													Delete
												</AlertDialog.Action>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<NoProblems />
			{/if}
		</Card.Content>
	</Card.Root>
{/if}
