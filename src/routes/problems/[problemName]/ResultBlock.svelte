<script>
	export let submission;
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

</script>

<Card.Root class="w-full" style="flex-grow: 1 ;overflow: auto;">
	<Card.Header>
		<Card.Title>Submission Result</Card.Title>
		<Card.Description>
			<Separator></Separator>
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<pre class="result-block"><code>{submission.result.stderr}</code></pre>
	</Card.Content>
</Card.Root>


<style>
    .result-block {
        margin: 0;
        font-size: 0.875rem;
    }
</style>
