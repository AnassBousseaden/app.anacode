<script>
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';

	export let input;
	export let output;
	export let offset;
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="text-lg font-medium">Example {offset + 1}</Card.Title>
	</Card.Header>

	<Card.Content class="space-y-4">
		<div>
			<div class="text-sm font-medium text-muted-foreground">Input:</div>
			<div class="rounded-md bg-muted p-2 overflow-auto">
				<pre class="text-sm"> <code>{input}</code> </pre>
			</div>
		</div>
		<Separator />
		<div>
			<div class="text-sm font-medium text-muted-foreground">Output:</div>
			<div class="rounded-md bg-muted p-2">
				<pre class="text-sm"> <code>{output}</code>  </pre>
			</div>
		</div>
	</Card.Content>
</Card.Root>
