<script>
	export let description = '';

	// Split description into paragraphs if it's a string
	let paragraphs = Array.isArray(description)
		? description
		: description.split(/\r?\n/);
</script>

<div class="space-y-4">
	{#each paragraphs as paragraph}
		<p class="leading-7 [&:not(:first-child)]:mt-6">{paragraph}</p>
	{/each}
</div>



