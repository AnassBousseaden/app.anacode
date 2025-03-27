<script>
  import { Button } from '$lib/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
  } from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select/index.js';
  import { Slider } from '$lib/components/ui/slider';
  import { editorSettings } from '$lib/app/components/editor/editor-settings.js';
  import { Label } from '$lib/components/ui/label/index.js';

  // Editor settings state
  let fontSize = $editorSettings.fontSize;
  let tabSize = $editorSettings.tabSize;

  let tabSizes = [
    { value: 2, label: '2 Spaces' },
    { value: 4, label: '4 Spaces' }
  ];

  let tabSizeSelector = tabSizes.find(({ value }) => value === tabSize);

  // Handle save action
  function handleSave() {
    $editorSettings.fontSize = fontSize;
    $editorSettings.tabSize = tabSizeSelector.value;
    $editorSettings.isModalOpened = false;
  }
</script>

<Dialog bind:open={$editorSettings.isModalOpened}>
	<DialogContent class="sm:max-w-md">
		<DialogHeader>
			<DialogTitle>Editor Settings</DialogTitle>
			<DialogDescription>
				Adjust your editor font and tab size
			</DialogDescription>
		</DialogHeader>
		<div class="grid grid-cols-2 auto-rows-fr items-center">

			<Label>Font Size</Label>
			<div class="flex items-center gap-2 space-x-2">
				<Slider
					id="fontSize"
					value={[fontSize]}
					onValueChange={(values) => fontSize = values[0]}
					min={10}
					max={24}
					step={1}
					class="flex-1"
				/>
				<span class="w-12 text-center">{fontSize}px</span>
			</div>
			<Label class="text-nowrap">Tab Size</Label>
			<div class="flex items-center space-x-2">
				<Select.Root bind:selected={tabSizeSelector}>
					<Select.Trigger class="w-full">
						<Select.Value placeholder="Select a tab size" />
					</Select.Trigger>
					<Select.SelectContent>
						{#each tabSizes as tab}
							<Select.SelectItem value={tab.value} label={tab.label}></Select.SelectItem>
						{/each}
					</Select.SelectContent>
				</Select.Root>
			</div>
		</div>





		<DialogFooter class="flex">
			<Button class="flex-1 justify-center" on:click={handleSave}>Save & Quit</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>