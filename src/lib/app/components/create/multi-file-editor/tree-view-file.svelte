<script lang="ts">
	import { File as FileIcon, XIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';
	import { writable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { File, FileComponent } from '$lib/app/components/create/multi-file-editor/file.manager.ts';
	import type { Writable } from 'svelte/store';

	export let fileComponent: FileComponent;
	export let isReadOnly: boolean;

	import * as ContextMenu from '$lib/components/ui/context-menu';

	let file = fileComponent.fileWritable;
	let onDelete: (fileWritable: Writable<File>) => void = fileComponent.onDeleteFile;
	let onSelect: (fileWritable: Writable<File>) => void = fileComponent.onSelectFile;

	// Delete
	let deleteEvent = (event: Event) => {
		event.stopPropagation();
		onDelete(file);
	};

	let editFileName = (name: string) => {
		if (!$file.canRename || isReadOnly) return;
		$file.name = name;
	};

	let onBlurEvent = () => {
		editFileName($editStore.name);
		$editStore.isEditing = false;
	};


	function autoFocus(node) {
		node.focus();
	}

	let onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			editFileName($editStore.name);
			$editStore.isEditing = false;
		} else if (event.key === 'Escape') {
			$editStore.isEditing = false;
			$editStore.name = $file.name;
		} else event.stopPropagation();
	};

	interface EditState {
		name: string;
		isEditing: boolean;
	}

	let editStore: Writable<EditState> = writable({
			name: $file.name,
			isEditing: false
		}
	);

	function handleEvent(event: MouseEvent) {
		// Differentiate between single and double click
		if (event.detail === 1) {
			onSelect(file);
		} else if (event.detail === 2) {
			$editStore.isEditing = true;
			console.log('dblclicked');
		}
	}


</script>


<ContextMenu.Root>
	<ContextMenu.Trigger>
		<Button
			variant='link'
			class={
	cn(
    'root-7',
    'p-0 h-6',
    'text-secondary-foreground',
    'flex flex-nowrap gap-1 flex-1',
    'rounded-l-none',
		$file.isSelected && 'bg-secondary/60 border-secondary ',
		)
	}
			onclick={handleEvent}
		>
			<FileIcon class="size-4" />
			<div class="flex-grow">
				{#if $editStore.isEditing}
					<input
						class={cn(
				"border-input placeholder:text-muted-foreground focus-visible:ring-ring flex rounded-md border bg-transparent px-3 shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
				"p-0",
				"flex-grow",
			)}
						type="text"
						bind:value={$editStore.name}
						onblur={onBlurEvent}
						onclick={(event: Event) =>  event.stopPropagation()}
						onkeydown={onKeyDown}
						use:autoFocus
					/>
				{:else }
					<div
						class="flex flex-grow flex-col justify-center items-start border border-transparent h-6 text-nowrap">{$file.name}</div>
				{/if}
			</div>
			<Button onclick={deleteEvent} variant="ghost" size="icon"
							class="p-0 h-4 w-4 ml-auto mr-1 flex-shrink-0">
				<XIcon class="h-3 w-3" />
			</Button>
		</Button>


	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item>Profile</ContextMenu.Item>
		<ContextMenu.Item>Billing</ContextMenu.Item>
		<ContextMenu.Item>Team</ContextMenu.Item>
		<ContextMenu.Item>Subscription</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>


<style>
</style>