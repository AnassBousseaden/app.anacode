<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		getProgrammingLanguageNameFromID
	} from '$lib/app/utils.js';
	import type { LanguagePreview, PrivateExecutionContext } from '$lib/api/anacode/models';
	import { get } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { ChevronsUpDown, Trash2 } from 'lucide-svelte';

	export let executionContext: Writable<PrivateExecutionContext>;
	export let programmingLanguages: LanguagePreview[];
	export let onSelect = () => console.log('ExecutionContextPreview.onSelect');
	export let onDelete = () => console.log('ExecutionContextPreview.onDelete');
	export let isSelected: Boolean = false;

	function handleDelete(event) {
		event.stopPropagation();
		onDelete();
	}

</script>

<div class="w-full">
	<Button
		on:click={onSelect}
		variant={isSelected ? "secondary" : "outline"}
		class="flex w-full items-center justify-between border rounded-md px-4 py-3 h-auto">
		<div class="flex-1 text-left overflow-hidden">
			<h1 class="text-sm font-semibold truncate">
				{getProgrammingLanguageNameFromID(programmingLanguages, get(executionContext).language_id)}
			</h1>
		</div>
		<div class="flex items-center">
			<Button
				onclick={handleDelete}
				class="h-8 w-8 hover:text-destructive"
				variant="ghost" size="icon">
				<Trash2 />
			</Button>
		</div>
	</Button>
</div>