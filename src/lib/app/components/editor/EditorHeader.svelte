<script lang="js">
  import { Button } from '$lib/components/ui/button/index.js';
  import { editorSettings } from '$lib/app/components/editor/editor-settings.js';
  import { LoaderCircle, RotateCcw, Settings2, SquareChevronRight } from 'lucide-svelte';
  import LanguageSelector from '$lib/app/components/language/LanguageSelector.svelte';

  export let restoreCodeStore;
  export let handleSubmit;
  export let disabled;

  export let languagesSelector;
  export let currentLanguageId;
</script>

<div class="bg-muted text-muted-foreground h-9 rounded-lg p-1 w-full"
		 style="display: flex; justify-content: space-between;">
	<Button
		disabled={disabled}
		class="h-full px-4 py-2 flex items-center gap-2 hover:bg-opacity-90 transition-all duration-200"
		on:click={handleSubmit}
	>
		{#if disabled}
			<LoaderCircle class="mr-0 h-5 w-5 animate-spin" />
			Running
		{:else}
			Submit
			<SquareChevronRight class="w-5 h-5" />
		{/if}
	</Button>
	<div class="h-full ml-auto flex items-center">
		<LanguageSelector bind:currentLanguageId={currentLanguageId} languages={languagesSelector} />
		<Button on:click={restoreCodeStore} variant="ghost" size="icon" class="h-full">
			<RotateCcw />
		</Button>
		<Button on:click={() =>  $editorSettings.isModalOpened = true} variant="ghost" size="icon" class="h-full">
			<Settings2 />
		</Button>
	</div>
</div>
