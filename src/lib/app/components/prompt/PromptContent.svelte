<script>
  import Description from './Description.svelte';
  import Example from './Example.svelte';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';

  export let title;
  export let description;
  export let examples;
  export let difficulty;
  export let languages;
</script>

<Card.Root class="h-full overflow-auto flex-grow">
	<Card.Header class="space-y-2">
		<Card.Title>
			<h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl break-words">
				{title}
			</h1>
		</Card.Title>
		<Card.Description>
			<Separator />
			<Badge class="my-2">{difficulty}</Badge>
			<Separator />
			<div class="space-x-1">
				{#each languages as language_name}
					<Badge variant="secondary" class="my-2">{language_name}</Badge>
				{/each}
			</div>
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
