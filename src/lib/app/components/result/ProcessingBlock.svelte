<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Loader2 } from 'lucide-svelte';
</script>

<Card.Root
	class="items-center justify-center flex flex-col h-full w-full animate-pulse border-4 border-primary"
	role="status"
	aria-busy="true"
	aria-live="polite"
>
	<!-- Spinning loader icon -->
	<div>
		<Loader2 size={105} class="text-primary animate-spin" />
	</div>
</Card.Root>
