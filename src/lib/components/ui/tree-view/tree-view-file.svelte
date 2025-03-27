<script>
  import { File, XIcon } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { writable } from 'svelte/store';
  import { Button } from '$lib/components/ui/button/index.js';


  const doNothing = () => {
    console.log('doNothing');
  };


  let {
    type = 'button',
    name,
    icon,
    isSelected,
    editCallback = doNothing,
    deleteCallback = doNothing,
    class: className,
    ...rest
  } = $props();

  function autoFocus(node) {
    node.focus();
  }


  let onKeyDown = (event) => {
    if (event.key === 'Enter') {
      editCallback(name, $editStore.name);
      $editStore.isEditing = false;
    } else if (event.key === 'Escape') {
      $editStore.isEditing = false;
      $editStore.name = name;
    } else event.stopPropagation();
  };

  let editStore = writable({
      name: name,
      isEditing: false
    }
  );

</script>

<Button
	variant='link'
	class={
	cn(
    'root-7',
    'p-0 h-6',
    'text-secondary-foreground',
    'flex flex-nowrap gap-1 flex-grow',
    'rounded-l-none',
		className,
		isSelected && 'bg-secondary/60 border-secondary ',
		)
	}
	{...rest}
	ondblclick={() => $editStore.isEditing = true}
>
	{#if icon}
		{@render icon({ name })}
	{:else}
		<File class="h-4 flex-shrink-0" />
	{/if}
	<div class="flex-grow items-stretch">
		{#if $editStore.isEditing}
			<input
				class={cn(
				"border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
				"p-0",
				"flex-grow"
			)}
				type="text"
				bind:value={$editStore.name}
				onblur={() => {
        editCallback(name , $editStore.name);
        $editStore.isEditing = false;
			}}
				onclick={(event) =>  event.stopPropagation()}
				onkeydown={onKeyDown}
				use:autoFocus
			/>
		{:else }
			<div class= "flex flex-col justify-center items-start border border-transparent h-6">{name}</div>
		{/if}
	</div>

	<Button onclick={(event) =>  {event.stopPropagation() ;deleteCallback();}} variant="ghost" size="icon" class="p-0 h-4 w-4 ml-auto mr-1 flex-shrink-0">
		<XIcon class="h-3 w-3"></XIcon>
	</Button>

</Button>

<style>
</style>