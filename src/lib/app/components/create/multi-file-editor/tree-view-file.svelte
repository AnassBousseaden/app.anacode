<!-- tree-view-file.svelte -->
<script lang="ts">
	import { File as FileIcon } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	import type { File, FileComponent } from './file.manager';

	// Provided by parent:
	export let fileComponent: FileComponent;
	export let isReadOnly: boolean;

	// derived references
	let file = fileComponent.fileWritable;

	// Show/hide rename dialog
	let showRenameDialog = false;
	let tempName = $file.name;

	function handleClick(event: MouseEvent) {
		event.stopPropagation();
		fileComponent.onSelectFile(file);
	}

	function openRenameDialog(event: MouseEvent) {
		event.stopPropagation();
		if (!$file.canRename || isReadOnly) return;
		tempName = $file.name;
		showRenameDialog = true;
	}

	function confirmRename() {
		if (!$file.canRename || isReadOnly) return;
		// Let the parent or the parent’s controller handle rename,
		// or do it directly if you prefer:
		$file.name = tempName;
		showRenameDialog = false;
	}

	function handleDelete(event: MouseEvent) {
		event.stopPropagation();
		if (!$file.canDelete || isReadOnly) return;
		fileComponent.onDeleteFile(file);
	}

	// If you want a context menu, you can let the parent handle it:
	export let onContextMenu: () => void = () => {
	};

	function handleContextMenu(event: MouseEvent) {
		if (onContextMenu) onContextMenu();
		event.preventDefault();
		event.stopPropagation();
	}
</script>

<Button
	variant="link"
	on:click={handleClick}
	oncontextmenu={handleContextMenu}

	class={cn(
		'p-0 h-6 w-full flex gap-1 items-center text-secondary-foreground',
		$file.isSelected && 'bg-secondary/60 border-secondary',
		""
	)}
>
	<FileIcon class="size-4" />
	<div class="flex-grow text-start text-sm">
		{$file.name}
	</div>
</Button>

<Dialog.Root bind:open={showRenameDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Rename File</Dialog.Title>
			<Dialog.Description>
				Enter the new filename, then click “Save changes.”
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="filename" class="text-right">Filename</Label>
				<Input
					id="filename"
					bind:value={tempName}
					class="col-span-3"
				/>
			</div>
		</div>
		<Dialog.Footer>
			<!-- Could also just call a parent-provided rename function -->
			<Button on:click={confirmRename} type="submit">
				Save changes
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
