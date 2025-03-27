<script>
  import { cn } from '$lib/utils.js';

  let { children, class: className } = $props();
</script>

<div class={cn('flex flex-col', className)}>
	{@render children?.()}
</div>
