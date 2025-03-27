<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	export let currentLanguageId = 8;
	export let languages = [
		{
			value: '5',
			label: 'Java'
		},
		{
			value: '6',
			label: 'Python'
		},
		{
			value: '7',
			label: 'Kotlin'
		},
		{
			value: '8',
			label: 'OCaml'
		}
	];

	let open = false;

	$: selectedValue =
		languages.find((f) => f.value === `${currentLanguageId}`)?.label ?? 'Select a language...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[200px] justify-between h-8"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Group>
				{#each languages as framework}
					<Command.Item
						value={framework.value}
						onSelect={(currentValue) => {
       currentLanguageId = Number(currentValue);
       closeAndFocusTrigger(ids.trigger);
      }}
					>
						<Check
							class={cn(
        "mr-2 h-4 w-4",
        `${currentLanguageId}` !== framework.value && "text-transparent"
       )}
						/>
						{framework.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>