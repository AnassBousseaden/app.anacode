<script>
	import Description from '$lib/app/components/prompt/Description.svelte';
	import ResultBlock from '$lib/app/components/result/ResultBlock.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import Example from '$lib/app/components/prompt/Example.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<Tabs.Root value="prompt" class="flex flex-col flex-grow shrink	min-h-0">
	<Tabs.List class="grid w-full grid-cols-3">
		<Tabs.Trigger value="prompt">Description</Tabs.Trigger>
		<Tabs.Trigger value="driver_code">Description</Tabs.Trigger>
		<Tabs.Trigger value="test_code">Description</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="prompt" class="flex-grow overflow-auto">
	</Tabs.Content>

	<Tabs.Content value="driver_code" class="flex-grow overflow-auto">

	</Tabs.Content>
	<Tabs.Content value="test_code" style="flex-grow: 1">

	</Tabs.Content>
</Tabs.Root>
