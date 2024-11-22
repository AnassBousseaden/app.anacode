<script>
	import Description from './Description.svelte';
	import Example from './Example.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator';

	export let title;
	export let description;
	export let examples;
</script>


<Tabs.Root value="prompt" style="flex-grow: 1;display:flex;flex-direction: column">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger value="prompt">Description</Tabs.Trigger>
		<Tabs.Trigger value="submissions">Submissions</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="prompt" style="flex-grow: 1">
		<Card.Root class="h-full">
			<Card.Header class="space-y-2">
				<Card.Title class="text-3xl">{title}</Card.Title>
				<Card.Description>
					<Separator />
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<Description {description}></Description>
				{#each examples as { input, output }, offset}
					<Example {offset} {input} {output}></Example>
				{/each}
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
	<Tabs.Content value="submissions" style="flex-grow: 1">
		<Card.Root class="h-full">
			<Card.Header class="space-y-2">
				<Card.Title>Submissions</Card.Title>
				<Card.Description>
					Checkout your submissions here
					<Separator />
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
			</Card.Content>
			<Card.Footer>
			</Card.Footer>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>


<style>
</style>
