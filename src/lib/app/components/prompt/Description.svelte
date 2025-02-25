<!--
<script>
  export let description = '';

  let formattedContent = [];

  $: {
    const lines = Array.isArray(description) ? description : description.split(/\r?\n/);
    formattedContent = [];
    let currentList = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();

      // Skip empty lines but handle list termination
      if (!trimmedLine) {
        if (currentList) {
          formattedContent.push(currentList);
          currentList = null;
        }
        return;
      }

      // Check if line is a bullet point
      if (trimmedLine.startsWith('-')) {
        if (!currentList) {
          currentList = [];
        }
        currentList.push(trimmedLine.substring(1).trim());
      } else {
        // If we have a pending list, add it before adding the paragraph
        if (currentList) {
          formattedContent.push(currentList);
          currentList = null;
        }
        formattedContent.push(trimmedLine);
      }
    });

    // Don't forget to add the last list if there is one
    if (currentList) {
      formattedContent.push(currentList);
    }
  }

</script>

<div class="space-y-4 p-4 bg-muted/30 border-border">
	{#each formattedContent as content}
		{#if Array.isArray(content)}
			<ul class="my-6 ml-6 list-disc [&>li]:mt-2">
				{#each content as item}
					<li class="">{item}</li>
				{/each}
			</ul>
		{:else}
			<p class="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
		{/if}
	{/each}
</div>-->
<!--
<script>
  import MarkdownIt from 'markdown-it';
  import sanitizer from 'markdown-it-sanitizer';

  export let description = '';

  let htmlContent = '';

  const md = new MarkdownIt({
    html: false,
    linkify: false,
    typographer: false
  })
    .disable(['link', 'image'])
    .use(sanitizer, {
      allowedTags: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
      allowedAttributes: {}
    });

  $: htmlContent = md.render(description);
</script>

<div class="prose dark:prose-invert !max-w-none !w-full">
	{@html htmlContent}
</div>
-->
<script>
  import MarkdownIt from 'markdown-it';
  import sanitizer from 'markdown-it-sanitizer';

  export let description = '';
  let htmlContent = '';

  const md = MarkdownIt({
    html: false,
    linkify: false,
    typographer: true
  })
    .disable(['link', 'image'])
    .use(sanitizer, {
      allowedTags: [
        'p', 'strong', 'em', 'ul', 'ol', 'li',
        'h1', 'h2', 'h3', 'blockquote', 'code',
        'pre'
      ],
      allowedAttributes: {}
    });

  $: htmlContent = description ? md.render(description.trim()) : '';
</script>

<div
	class="prose dark:prose-invert !max-w-none !w-full antialiased"
	data-testid="markdown-content"
>
	{@html htmlContent}
</div>