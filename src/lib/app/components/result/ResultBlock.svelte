<script>
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	export let submission;
</script>

<Card.Root class="flex-col flex-grow shrink overflow-auto flex">
	<Card.Header>
		<Card.Title>Submission Result</Card.Title>
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
