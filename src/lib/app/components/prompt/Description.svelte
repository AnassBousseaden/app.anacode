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

  $: htmlContent = description ? md.render(description) : '';
</script>

<div
	class="prose dark:prose-invert !max-w-none !w-full antialiased break-words"
	data-testid="markdown-content"
>
	{@html htmlContent}
</div>