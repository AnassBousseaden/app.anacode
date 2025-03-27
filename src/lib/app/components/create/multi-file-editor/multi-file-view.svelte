<script lang="ts">
	import TreeViewFolder from '$lib/app/components/create/multi-file-editor/tree-view-folder.svelte';
	import TreeViewFile from '$lib/app/components/create/multi-file-editor/tree-view-file.svelte';
	import { Button } from '$lib/components/ui/button';
	import { FolderInput, FolderOutput, FolderPlus, Plus } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Editor from '$lib/app/components/editor/Editor.svelte';
	import { cn } from '$lib/utils.js';
	import { fileNameToMonacoLanguageName, localStorageJsonWritable } from '$lib/app/utils.js';
	import { get, writable } from 'svelte/store';
	import {
		addNewDirectory,
		addNewFile,
		deleteFile
	} from '$lib/app/components/create/multi-file-editor/file.manager.js';
	import { EditorManager, newDirectory } from '$lib/app/components/create/multi-file-editor/file.manager.js';
	import type {
		DirectoryComponent,
		Directory,
		File
	} from '$lib/app/components/create/multi-file-editor/file.manager.ts';
	import type { Writable } from 'svelte/store';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	let sidebarVisible = writable(true);
	let boxDir: Writable<Directory> = newDirectory('box', false, false, false, true);
	let currentDirectory: Writable<Directory> = boxDir;
	let currentFile: Writable<File> | null = null;
	export let changeRequester: Writable<number> = writable(1);

	let dirComponent: DirectoryComponent = {
		directory: boxDir,
		onDeleteFile(directoryWritable: Writable<Directory>, fileWritable: Writable<File>) {
			if (currentFile == fileWritable) {
				currentFile = null;
			}
			deleteFile(directoryWritable, fileWritable);
		},
		onSelectDirectory(dirSelected: Writable<Directory>) {
			currentDirectory.update((dir) => {
				dir.isSelected = false;
				return dir;
			});
			currentDirectory = dirSelected;
			dirSelected.update((dir) => {
				dir.isSelected = true;
				return dir;
			});
			changeRequester.update((x) => x + 1);
		},
		onSelectFile(dirSelected: Writable<Directory>, fileWritable: Writable<File>) {
			if (fileWritable == currentFile) {
				console.log('nothings has changed:');
				return;
			}
			console.log('selectFile request:', get(fileWritable));
			currentFile?.update((file) => {
				file.isSelected = false;
				return file;
			});
			currentDirectory = dirSelected;
			currentFile = fileWritable;
			fileWritable.update((file) => {
				file.isSelected = true;
				return file;
			});
			changeRequester.update((x) => x + 1);
		}
	};


</script>

<div class="h-full w-full flex overflow-hidden">


	<Collapsible.Root bind:open={$sidebarVisible} class="overflow-hidden">
		<Collapsible.Content class="border-r h-full flex flex-col min-w-[250px] p-2">
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium">Files</h3>
				<div class="ml-auto">
					<Button
						variant="ghost"
						size="sm"
						class="ml-auto h-6 w-6 p-0"
						onclick={() => addNewFile(currentDirectory)}
					>
						<Plus class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						class="ml-auto h-6 w-6 p-0"
						onclick={() => addNewDirectory(currentDirectory)}
					>
						<FolderPlus class="h-4 w-4" />
					</Button>
				</div>
			</div>
			<TreeViewFolder directoryComponent={dirComponent} isReadOnly={false} open={true} />
		</Collapsible.Content>
	</Collapsible.Root>

	<div class="flex-grow flex flex-col h-full overflow-hidden">
		<div class="p-2 border-b flex items-center">
			<Button
				variant="ghost"
				size="sm"
				class="mr-2 h-8 w-8 p-0"
				onclick={() => $sidebarVisible = !$sidebarVisible}
				aria-label={$sidebarVisible ? "Hide sidebar" : "Show sidebar"}
			>
				{#if $sidebarVisible}
					<FolderOutput class="h-4 w-4" />
				{:else}
					<FolderInput class="h-4 w-4" />
				{/if}
			</Button>
			<Badge variant="outline">{currentFile == null ? '' : $currentFile.name}</Badge>
		</div>

		<div class="flex-grow flex overflow-hidden">
			{#if currentFile && currentFile !== null}
				<Editor
					bind:codeStore={$currentFile.content}
					changeRequest={changeRequester}
				/>
			{/if}
		</div>
	</div>
</div>
