<script>
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Card from '$lib/components/ui/card/index.js';

  export let input;
  export let output;
  export let offset;
</script>

<Card.Root class="w-full">
	<Card.Header class="p-0 mx-4 mt-4">
		<Card.Title class="text-lg font-medium">Example {offset + 1}</Card.Title>
	</Card.Header>

	<Card.Content class="space-y-3 p-4">
		{@render example(input)}
		<Separator />
		{@render example(output)}
	</Card.Content>
</Card.Root>

{#snippet example(content) }
	<div>
		<div class="text-sm font-medium text-muted-foreground">Output:</div>
		<div class="rounded-md bg-muted p-2 overflow-auto">
			<pre class="text-sm"> <code>{content}</code>  </pre>
		</div>
	</div>
{/snippet}