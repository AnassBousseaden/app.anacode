<script>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Code, FolderCode, Pencil, PencilLine, Plus, PlusCircle, Trash, Trash2 } from 'lucide-svelte';
  import { base } from '$app/paths';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Table from '$lib/components/ui/table/index.js';
  import NoProblems from '$lib/app/components/create/NoProblems.svelte';
  import { jsonToQueryParams } from '$lib/app/utils.js';
  import { deleteUserProblem } from '$lib/api/anacode/api.anacode.js';

  export let data;
  let { problems } = data;
  console.log(problems);

  async function deleteProblem(problem_id) {
    try {
      await deleteUserProblem(problem_id);
      problems = problems.filter(problem => problem.id !== problem_id);
    } catch (err) {
      alert('Deletion failed');
    }
  }


</script>


{#if problems.length === 0}
	<NoProblems />
{:else }
	<Card.Root class="xl:col-span-1 w-2/3">
		<Card.Header class="flex flex-row items-center">
			<div class="grid gap-2">
				<Card.Title>Your Programming Problems</Card.Title>
				<Card.Description>Manage Your Programming Problems</Card.Description>
			</div>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Id</Table.Head>
						<Table.Head>Title</Table.Head>
						<Table.Head>Difficulty</Table.Head>
						<Table.Head>Last Update</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each problems as { id, title, difficulty, updated_at }}
						<Table.Row>
							<Table.Cell>
								{id}
							</Table.Cell>
							<Table.Cell>
								<a href="{base}/problems/{id}" class="font-medium">{title}</a>
							</Table.Cell>
							<Table.Cell>
								<Badge>
									{difficulty}
								</Badge>
							</Table.Cell>
							<Table.Cell>
								{new Date(updated_at).toLocaleString()}
							</Table.Cell>
							<Table.Cell class="text-right">
								<Button href={`/my-problems/create?${jsonToQueryParams({problem_id:id})}`} size="icon">
									<PencilLine class="w-4 h-4" />
								</Button>

								<AlertDialog.Root>
									<AlertDialog.Trigger asChild let:builder>
										<Button on:click={() => console.log("delete")} builders={[builder]} variant="destructive"
														size="icon">
											<Trash2 class="w-4 h-4" />
										</Button>
									</AlertDialog.Trigger>
									<AlertDialog.Content>
										<AlertDialog.Header>
											<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
											<AlertDialog.Description>
												This action cannot be undone. This will permanently delete the problem
												and remove associated data from our servers.
											</AlertDialog.Description>
										</AlertDialog.Header>
										<AlertDialog.Footer>
											<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
											<AlertDialog.Action on:click={() => deleteProblem(id)}>Confirm</AlertDialog.Action>
										</AlertDialog.Footer>
									</AlertDialog.Content>
								</AlertDialog.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
					<Table.Row>
						<Table.Cell class="items-center" colspan="5">


							<Button href="{base}/my-problems/create" class="w-full gap-2">
								<PlusCircle class="h-4 w-4" />
								Create a Problem
							</Button>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
{/if}
