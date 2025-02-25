<script>
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { ChevronDown } from 'lucide-svelte';

  export let submission;
  export let collapse;
</script>

<Card.Root class="flex-col flex-grow shrink overflow-auto flex">
	<Card.Header>
		<div class="flex flex-row items-center justify-between w-full">
			<Card.Title>Submission Result</Card.Title>
			{#if collapse}
				<Button
					variant="ghost"
					size="icon"
					on:click={collapse}
					class="h-8 w-8 p-0"
				>
					<ChevronDown class="h-4 w-4" />
				</Button>
			{/if}
		</div>
		<Card.Description>
			<Separator></Separator>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<pre class="result-block overflow-auto"><code>{submission}</code></pre>
	</Card.Content>
</Card.Root>

<style>
    .result-block {
        margin: 0;
        font-size: 0.875rem;
    }
</style>