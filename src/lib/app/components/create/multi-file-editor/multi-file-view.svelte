<!-- multi-file-view.svelte -->
<script lang="ts">
	import { writable, get } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { fileNameToMonacoLanguageName } from '$lib/app/utils.js';
	import TreeViewFolder from './tree-view-folder.svelte';
	import Editor from '$lib/app/components/editor/Editor.svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { FolderInput, FolderOutput, FilePlus2, FolderPlus, PencilLine, Trash2 } from 'lucide-svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { toast } from 'svelte-sonner';

	import {
		newDirectory
	} from './file.manager';

	import type {
		Directory,
		File,
		DirectoryComponent,
		DirectoryContextMenuEvent,
		FileContextMenuEvent
	} from './file.manager';

	import {
		createDirectory,
		createFile,
		deleteDirectory,
		deleteFile, findAnyFile,
		renameDirectory,
		renameFile,
		selectDirectory,
		selectFile
	} from './file.controller';

	export let rootDirectory: Writable<Directory> = newDirectory('box', false, false, false, true);

	let currentDirectory: Writable<Directory> = rootDirectory;
	let currentFile: Writable<File> | null = findAnyFile(rootDirectory);

	let sidebarVisible = writable(false);
	let changeRequester = writable(0);

	let dirComponent: DirectoryComponent = {
		directory: rootDirectory,

		onDeleteFile(dirWritable, fileWritable) {
			currentFile = deleteFile(dirWritable, fileWritable, rootDirectory, currentFile);
			changeRequester.update((n) => n + 1);
		},

		onSelectFile(dirWritable, fileWritable) {
			currentFile = selectFile(dirWritable, fileWritable, currentFile);
			currentDirectory = dirWritable; // if needed
			changeRequester.update((n) => n + 1);
		},

		onSelectDirectory(dirSelected) {
			currentDirectory = selectDirectory(dirSelected, currentDirectory);
			changeRequester.update((n) => n + 1);
		}
	};

	let directoryContextMenu: DirectoryContextMenuEvent | null = null;
	let fileContextMenu: FileContextMenuEvent | null = null;

	let showRenameDirectoryDialog = false;
	let showRenameFileDialog = false;

	// Temp inputs
	let directoryRenameInput = '';
	let fileRenameInput = '';

	function rootHandleContextMenu() {
		directoryContextMenu = { parent: null, node: rootDirectory };
		fileContextMenu = null;
	}

	function openContextMenuController(ctx: DirectoryContextMenuEvent) {
		fileContextMenu = null;
		directoryContextMenu = ctx;
	}

	function openFileContextMenuController(ctx: FileContextMenuEvent) {
		directoryContextMenu = null;
		fileContextMenu = ctx;
	}

	// Called from the <ContextMenu.Item> to create a new file
	function ctxMenuAddNewFile() {
		if (!directoryContextMenu) return;
		createFile(directoryContextMenu.node);
		changeRequester.update((n) => n + 1);
	}

	function ctxMenuAddNewDirectory() {
		if (!directoryContextMenu) return;
		createDirectory(directoryContextMenu.node);
		changeRequester.update((n) => n + 1);
	}

	function openRenameDirectoryDialog() {
		if (!directoryContextMenu) return;
		const nodeVal = get(directoryContextMenu.node);
		// fill the rename input
		directoryRenameInput = nodeVal.name;
		showRenameDirectoryDialog = true;
	}

	function saveDirectoryRename() {
		if (!directoryContextMenu) return;
		const dirNode = directoryContextMenu.node;
		renameDirectory(dirNode, directoryRenameInput);
		showRenameDirectoryDialog = false;
		changeRequester.update((n) => n + 1);
	}

	function openRenameFileDialog() {
		if (!fileContextMenu) return;
		const fileVal = get(fileContextMenu.node);
		fileRenameInput = fileVal.name;
		showRenameFileDialog = true;
	}

	function saveFileRename() {
		if (!fileContextMenu) return;
		renameFile(fileContextMenu.node, fileRenameInput);
		showRenameFileDialog = false;
		changeRequester.update((n) => n + 1);
	}

	function deleteDirectoryEvent() {
		if (!directoryContextMenu) return;
		const { parent, node } = directoryContextMenu;
		if (!parent) return;
		currentFile = deleteDirectory(parent, node, rootDirectory, currentFile);
		changeRequester.update((n) => n + 1);
	}

	function deleteFileEvent() {
		if (!fileContextMenu) return;
		const { parent, node } = fileContextMenu;
		currentFile = deleteFile(parent, node, rootDirectory, currentFile);
		changeRequester.update((n) => n + 1);
	}
</script>

<div class="h-full w-full flex overflow-hidden">
	<Collapsible.Root bind:open={$sidebarVisible} class="overflow-auto">
		<Collapsible.Content class="border-r h-full w-full flex flex-col min-w-[250px] p-2">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium">Files</h3>
			</div>

			<!-- Right-click on root if desired -->
			<ContextMenu.Root>
				<ContextMenu.Trigger oncontextmenu={rootHandleContextMenu}>
					<TreeViewFolder
						directoryComponent={dirComponent}
						isReadOnly={false}
						open={true}
						openContextMenu={rootHandleContextMenu}
						openContextMenuController={openContextMenuController}
						openFileContextMenuController={openFileContextMenuController}
					/>
				</ContextMenu.Trigger>

				{#if directoryContextMenu || fileContextMenu}
					<ContextMenu.Content>

						{#if fileContextMenu}
							{#if get(fileContextMenu.node).canRename}
								<ContextMenu.Item on:click={openRenameFileDialog}>
									<PencilLine class="mr-2 size-5" />
									Rename
								</ContextMenu.Item>
							{/if}
							{#if get(fileContextMenu.node).canDelete}
								<ContextMenu.Separator />
								<ContextMenu.Item on:click={deleteFileEvent}>
									<Trash2 class="text-destructive mr-2 size-5" />
									Delete
								</ContextMenu.Item>
							{/if}
						{/if}

						{#if directoryContextMenu}
							{#if !get(directoryContextMenu.node).isReadOnly}
								<ContextMenu.Item on:click={ctxMenuAddNewFile}>
									<FilePlus2 class="mr-2 size-5" />
									New File
								</ContextMenu.Item>
								<ContextMenu.Item on:click={ctxMenuAddNewDirectory}>
									<FolderPlus class="mr-2 size-5" />
									New Directory
								</ContextMenu.Item>

								{#if get(directoryContextMenu.node).canRename}
									<ContextMenu.Item on:click={openRenameDirectoryDialog}>
										<PencilLine class="mr-2 size-5" />
										Rename
									</ContextMenu.Item>
								{/if}

								{#if get(directoryContextMenu.node).canDelete}
									<ContextMenu.Separator />
									<ContextMenu.Item on:click={deleteDirectoryEvent}>
										<Trash2 class="text-destructive mr-2 size-5" />
										Delete
									</ContextMenu.Item>
								{/if}
							{/if}
						{/if}
					</ContextMenu.Content>
				{/if}
			</ContextMenu.Root>
		</Collapsible.Content>
	</Collapsible.Root>

	<div class="flex-grow flex flex-col h-full overflow-hidden">
		<!-- Editor header row -->
		<div class="p-2 border-b flex items-center">
			<Button
				variant="ghost"
				size="sm"
				class="mr-2 h-8 w-8 p-0"
				onclick={() => $sidebarVisible = !$sidebarVisible}
				aria-label={$sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
			>
				{#if $sidebarVisible}
					<FolderOutput class="h-4 w-4" />
				{:else}
					<FolderInput class="h-4 w-4" />
				{/if}
			</Button>
			<Badge variant="outline">{currentFile == null ? '' : $currentFile.name}</Badge>
		</div>

		<!-- Editor content -->
		<div class="flex-grow flex overflow-hidden">
			{#if currentFile}
				<Editor
					bind:codeStore={$currentFile.content}
					changeRequest={changeRequester}
					language={fileNameToMonacoLanguageName($currentFile.name)}
					readOnly={$currentFile.isReadOnly}
				/>
			{/if}
		</div>
	</div>
</div>

<!-- Rename File Dialog -->
<Dialog.Root bind:open={showRenameFileDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Rename File</Dialog.Title>
			<Dialog.Description>
				Enter the new file name, then click “Save changes.”
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="rename-file" class="text-right">File Name</Label>
				<Input id="rename-file" bind:value={fileRenameInput} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button on:click={saveFileRename} type="submit">
				Save changes
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Rename Directory Dialog -->
<Dialog.Root bind:open={showRenameDirectoryDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Rename Directory</Dialog.Title>
			<Dialog.Description>
				Enter the new directory name, then click “Save changes.”
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="rename-dir" class="text-right">Directory Name</Label>
				<Input id="rename-dir" bind:value={directoryRenameInput} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button on:click={saveDirectoryRename} type="submit">
				Save changes
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
