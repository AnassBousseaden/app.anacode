<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { Folder, FolderOpen } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let { name, open = $bindable(true), class: className, icon, children } = $props();
</script>

<Collapsible.Root bind:open>
	<Collapsible.Trigger class={cn('flex place-items-center gap-1', className)}>
		{#if icon}
			{@render icon({ name, open })}
		{:else if open}
			<FolderOpen class="size-4" />
		{:else}
			<Folder class="size-4" />
		{/if}
		<span>{name}</span>
	</Collapsible.Trigger>
	<Collapsible.Content class="mx-2 border-l">
		<div class="relative flex place-items-start">
			<div class="mx-2 h-full w-[1px] bg-border"></div>
			<div class="flex flex-col flex-grow">
				{@render children?.()}
			</div>
		</div>
	</Collapsible.Content>
</Collapsible.Root>
