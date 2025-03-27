<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { CircleDot, DotIcon, DotSquareIcon, Folder, FolderOpen, Pen } from 'lucide-svelte';
	import TreeViewFolder from '$lib/app/components/create/multi-file-editor/tree-view-folder.svelte';
	import TreeViewFile from '$lib/app/components/create/multi-file-editor/tree-view-file.svelte';
	import { cn } from '$lib/utils';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import type {
		Directory,
		DirectoryComponent,
		File, FileComponent
	} from '$lib/app/components/create/multi-file-editor/file.manager.ts';

	export let directoryComponent: DirectoryComponent;
	export let isReadOnly: boolean = false;

	let directory: Writable<Directory> = directoryComponent.directory;
	let onSelectFile: (dir: Writable<Directory>, file: Writable<File>) => void = directoryComponent.onSelectFile;
	let onDeleteFile: (dir: Writable<Directory>, file: Writable<File>) => void = directoryComponent.onDeleteFile;
	let onSelectDirectory: (selectedDir: Writable<Directory>) => void = directoryComponent.onSelectDirectory;

	export let open = false;

	function buildFileComponent(fileWritable: Writable<File>): FileComponent {
		return {
			fileWritable: fileWritable,
			onSelectFile(fileWritable: Writable<File>) {
				onSelectFile(directory, fileWritable);
				directory.update((dir) => dir);
			},
			onDeleteFile(fileWritable: Writable<File>) {
				onDeleteFile(directory, fileWritable);
				directory.update((dir) => dir);
			}
		};
	}


	function buildDirComponent(dirWritable: Writable<Directory>): DirectoryComponent {
		return {
			directory: dirWritable,
			onDeleteFile: onDeleteFile,
			onSelectDirectory: onSelectDirectory,
			onSelectFile: onSelectFile
		};
	}

	let fileComponents: FileComponent[];

	directory.subscribe((dir) => {
		fileComponents = dir.files.map((file) => buildFileComponent(file));
	});

</script>

<Collapsible.Root onOpenChange={() => onSelectDirectory(directory)} bind:open>
	<Collapsible.Trigger ondblclick={() => console.log("clicl")}
											 class='w-full flex justify-start text-nowrap items-center gap-1'>
		<div class="flex justify-start  text-nowrap items-center gap-1">
			{#if open}
				<FolderOpen class="size-4" />
			{:else}
				<Folder class="size-4" />
			{/if}
			<div
				class="flex flex-col justify-center items-start border border-transparent h-6 text-nowrap text-sm">{$directory.name}</div>
		</div>
		{#if $directory.isSelected}
			<DotIcon class="p-0 mr-1 ml-auto size-4 text-primary" />
		{/if}
	</Collapsible.Trigger>
	<Collapsible.Content class="ml-0 border-l px-0">
		<div class="relative flex place-items-start">
			<div class="mx-1 h-full w-[1px] bg-border"></div>
			<div class="flex flex-col flex-grow">
				{#each $directory.children as subDirectory (subDirectory)}
					<TreeViewFolder
						directoryComponent={buildDirComponent(subDirectory)}
						isReadOnly={isReadOnly}
					/>
				{/each}
				{#each fileComponents as fileComponent (fileComponent) }
					<TreeViewFile
						fileComponent={fileComponent}
						isReadOnly={isReadOnly}
					/>
				{/each}
			</div>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
