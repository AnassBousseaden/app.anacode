<script>
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Plus, Minus } from 'lucide-svelte';
  import { Separator } from '$lib/components/ui/separator/index.js';

  export let form;

  const { form: formData, enhance, validateForm } = form;

  function addExample() {
    $formData.examples = [...$formData.examples, { input: '', output: '' }];
    if (validateForm) validateForm({ update: true });
  }

  function removeExample() {
    $formData.examples = $formData.examples.slice(0, -1);
  }

  $: selectedDifficulty = $formData.difficulty
    ? { label: $formData.difficulty, value: $formData.difficulty }
    : undefined;

</script>

<form class="px-1 flex flex-col flex-grow space-y-4" method="POST" use:enhance={enhance}>
	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label for="title">Title</Form.Label>
			<Input
				id="title"
				{...attrs}
				bind:value={$formData.title}
				placeholder="Enter title"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="difficulty">
		<Form.Control let:attrs>
			<Form.Label for="difficulty">Difficulty</Form.Label>
			<Select.Root
				selected={selectedDifficulty}
				onSelectedChange={(selected) => {selected && ($formData.difficulty = selected.value);}}>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Difficulty" />
				</Select.Trigger>
				<Select.SelectContent>
					<Select.SelectItem label="Easy" value="Easy">Easy</Select.SelectItem>
					<Select.SelectItem label="Medium" value="Medium">Medium</Select.SelectItem>
					<Select.SelectItem label="Hard" value="Hard">Hard</Select.SelectItem>
				</Select.SelectContent>
			</Select.Root>
			<input hidden bind:value={$formData.difficulty} name={attrs.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label for="description">Description</Form.Label>
			<Textarea
				id="description"
				{...attrs}
				bind:value={$formData.description}
				placeholder="Enter description"
				class="min-h-[360px]"
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div>
		<Label>Examples</Label>
		{#each $formData.examples as example, index}
			{#if index > 0}
				<Separator class="my-2" />
			{/if}
			<div class="space-y-2 mt-2">
				<Form.Field {form} name={`examples.${index}.input`}>
					<Form.Control let:attrs>
						<Input
							{...attrs}
							placeholder="Input"
							bind:value={example.input}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name={`examples.${index}.output`}>
					<Form.Control let:attrs>
						<Input
							{...attrs}
							placeholder="Output"
							bind:value={example.output}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
		{/each}

		<div class="flex gap-2 mt-2">
			<Button
				type="button"
				variant="outline"
				on:click={addExample}
				size="icon"
			>
				<Plus class="h-5 w-5" />
			</Button>

			{#if $formData.examples.length > 1}
				<Button
					type="button"
					variant="destructive"
					on:click={removeExample}
					size="icon"
				>
					<Minus class="h-5 w-5" />
				</Button>
			{/if}
		</div>
	</div>
</form>
