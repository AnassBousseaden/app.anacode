<script>
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import github from '$lib/images/github.svg';
	import {
		Button,
		buttonVariants
	} from '$lib/components/ui/button/index.js';
	import { Github } from 'lucide-svelte';

	export let performLogAction;
	export let showModal;
	export let title;
	export let description = 'Select one of the following providers';

</script>

<Dialog.Root bind:open={showModal}>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}
	>
		{title}
	</Dialog.Trigger
	>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{description}
			</Dialog.Description>
		</Dialog.Header>
		<Button variant="outline" on:click={performLogAction}>
			<Github class="mr-2 h-4 w-4 text-primary" />
			GitHub
		</Button>
	</Dialog.Content>
</Dialog.Root>

<style>
</style>
