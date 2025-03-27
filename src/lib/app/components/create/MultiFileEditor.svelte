<script>
  import * as TreeView from '$lib/components/ui/tree-view';
  import { Button } from '$lib/components/ui/button/index.js';
  import { FolderInput, FolderOutput, Plus } from 'lucide-svelte';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import Editor from '$lib/app/components/editor/Editor.svelte';
  import { cn } from '$lib/utils.js';
  import { fileNameToMonacoLanguageName, localStorageJsonWritable } from '$lib/app/utils.js';
  import { writable } from 'svelte/store';

  const doNothing = () => {
  };

  export let fileList;
  export let readOnly = false;
  export let addFile = doNothing;
  export let deleteFile = doNothing;
  export let editFileName = doNothing;

  let currentIndex = writable(0);
  fileList.subscribe((f) => {
    currentIndex.set(Math.min($currentIndex, f.length - 1));
    return f;
  });

  let sidebarVisible = localStorageJsonWritable('sidebar-visible', true);

  $: currentFileName = $fileList[$currentIndex].fileName;
  $: language = fileNameToMonacoLanguageName(currentFileName);

  function setActiveFile(index) {
    currentIndex.set(index);
  }

</script>

<div class="h-full w-full flex overflow-hidden">
	<!-- Sidebar -->
	<div class={cn("border-r h-full transition-all duration-300 flex flex-col", $sidebarVisible ? "w-[250px]" : "w-0")}>
		{#if $sidebarVisible}
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium">Files</h3>
				<Button
					variant="ghost"
					size="sm"
					class="ml-auto h-6 w-6 p-0"
					onclick={addFile}
				>
					<Plus class="h-4 w-4" />
				</Button>
			</div>

			<TreeView.Root class="overflow-auto flex-1">
				<TreeView.Folder name="box">
					{#each $fileList as file, index}
						<TreeView.File
							name={file.fileName}
							isSelected={index === $currentIndex}
							onclick={() => setActiveFile(index)}
							editCallback={ (oldName, newName)  =>  {editFileName(index, oldName, newName, file.canRename)} }
							deleteCallback={() => deleteFile(index)}
						/>
					{/each}
				</TreeView.Folder>
			</TreeView.Root>
		{/if}
	</div>

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
			<Badge variant="outline">{currentFileName}</Badge>
		</div>

		<div class="flex-grow flex overflow-hidden">
			<Editor
				readOnly={readOnly || $fileList[$currentIndex].isReadOnly}
				language={language}
				bind:codeStore={$fileList[$currentIndex].fileContent}
				changeRequest={currentIndex}
			/>
		</div>
	</div>
</div>
