<!-- tree-view-folder.svelte -->
<script lang="ts">
	import { writable, get } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { DotIcon, Folder, FolderOpen } from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import TreeViewFolder from './tree-view-folder.svelte';
	import TreeViewFile from './tree-view-file.svelte';

	import type {
		Directory,
		DirectoryComponent,
		File,
		FileComponent,
		DirectoryContextMenuEvent,
		FileContextMenuEvent
	} from './file.manager';

	export let directoryComponent: DirectoryComponent;
	export let isReadOnly: boolean = false;

	// convenience references:
	let directory: Writable<Directory> = directoryComponent.directory;
	let onSelectFile = directoryComponent.onSelectFile;
	let onDeleteFile = directoryComponent.onDeleteFile;
	let onSelectDirectory = directoryComponent.onSelectDirectory;

	// For context-menu
	export let openContextMenu: () => void;
	export let openContextMenuController: (ctx: DirectoryContextMenuEvent) => void;
	export let openFileContextMenuController: (ctx: FileContextMenuEvent) => void;

	export let open = true;

	function handleDirectoryClick() {
		// If you want to treat the folder click as a "select directory", do so here:
		onSelectDirectory(directory);
	}

	function handleContextMenu(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (openContextMenu) openContextMenu();
	}

	// Build FileComponent for each file, so the file Svelte can call back:
	function buildFileComponent(fileWritable: Writable<File>): FileComponent {
		return {
			fileWritable,
			onSelectFile: (f: Writable<File>) => {
				onSelectFile(directory, f);
			},
			onDeleteFile: (f: Writable<File>) => {
				onDeleteFile(directory, f);
			}
		};
	}

	// Build DirectoryComponent for each child directory:
	function buildDirComponent(childDir: Writable<Directory>): DirectoryComponent {
		return {
			directory: childDir,
			onSelectFile,
			onDeleteFile,
			onSelectDirectory
		};
	}

	let fileComponents: FileComponent[] = [];
	directory.subscribe((dir) => {
		fileComponents = dir.files.map((f) => buildFileComponent(f));
	});
</script>

<!-- Collapsible folder -->
<Collapsible.Root bind:open>
	<Collapsible.Trigger
		onclick={handleDirectoryClick}
		oncontextmenu={handleContextMenu}
		class="w-full flex gap-1 items-center"
	>
		{#if open}
			<FolderOpen class="size-4" />
		{:else}
			<Folder class="size-4" />
		{/if}
		<div class="flex-grow text-start text-sm">
			{$directory.name}
		</div>
		{#if $directory.isSelected}
			<DotIcon class="p-0 mr-1 ml-auto size-4 text-primary" />
		{/if}
	</Collapsible.Trigger>

	<!-- The Collapsible.Content will show sub-directories and files -->
	<Collapsible.Content class="ml-4 border-l pl-2">
		{#each $directory.children as childDir (childDir)}
			<TreeViewFolder
				directoryComponent={buildDirComponent(childDir)}
				isReadOnly={isReadOnly}
				openContextMenu={() => openContextMenuController({ parent: directory, node: childDir })}
				openContextMenuController={openContextMenuController}
				openFileContextMenuController={openFileContextMenuController}
				open={true}
			/>
		{/each}

		{#each fileComponents as fileComp (fileComp)}
			<TreeViewFile
				fileComponent={fileComp}
				isReadOnly={isReadOnly}
				onContextMenu={() => openFileContextMenuController({ parent: directory, node: fileComp.fileWritable })}
			/>
		{/each}
	</Collapsible.Content>
</Collapsible.Root>
