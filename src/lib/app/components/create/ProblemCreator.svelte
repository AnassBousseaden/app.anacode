<script>

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Plus, Minus, ChevronRight } from 'lucide-svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { z } from 'zod';
	import { localStorageJsonWritable } from '$lib/app/utils.js';

	export let title;
	export let difficulty;
	export let description;
	export let examples;

	export let errors = {};

	let diff = { value: difficulty, label: difficulty };

	$: difficulty = diff.value;
	$: examples = [...examples];


	function addExample() {
		examples = [...examples, { input: '', output: '' }];
	}

	function removeExample() {
		examples = examples.slice(0, -1);
	}

</script>

<form class="px-1 flex flex-col flex-grow space-y-4">
	<div>
		<Label for="title">Title</Label>
		<Input
			id="title"
			bind:value={title}
			placeholder="Enter title"
		/>
		{#if errors.title}
			<p class="text-destructive text-sm">{errors.title[0]}</p>
		{/if}
	</div>

	<div>
		<Label for="Difficulty">Difficulty</Label>
		<Select.Root bind:selected={diff}>
			<Select.Trigger class="w-full">
				<Select.Value placeholder="Difficulty" />
			</Select.Trigger>
			<Select.SelectContent>
				<Select.SelectItem value="Easy">Easy</Select.SelectItem>
				<Select.SelectItem value="Medium">Medium</Select.SelectItem>
				<Select.SelectItem value="Hard">Hard</Select.SelectItem>
			</Select.SelectContent>
		</Select.Root>
		{#if errors.difficulty}
			<p class="text-destructive text-sm">{errors.difficulty[0]}</p>
		{/if}
	</div>

	<div>
		<Label for="description">Description</Label>
		<Textarea
			id="description"
			bind:value={description}
			placeholder="Enter description"
			class="min-h-[120px]"
		/>
		{#if errors.description}
			<p class="text-destructive text-sm">{errors.description[0]}</p>
		{/if}
	</div>

	<div>
		<Label>Examples</Label>
		{#each examples as example, index}
			{#if index > 0}
				<Separator class="my-2" />
			{/if                                        }
			<div class="space-y-2 mt-2">
				<Input
					placeholder="Input"
					bind:value={example.input}
				/>
				<Input
					placeholder="Output"
					bind:value={example.output}
				/>
			</div>
		{/each}
		{#if errors.examples}
			<p class="text-destructive text-sm">{errors.examples[0]}</p>
		{/if}
		<Button
			type="button"
			variant="outline"
			on:click={addExample}
			class="mt-2"
			size="icon"
		>
			<Plus class="h-5 w-5" />
		</Button>
		{#if examples.length > 1}
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
</form>
