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
	<Loader2 size={105} class="text-primary animate-spin" />

	<!-- Screen-reader-only text to announce a loading state -->
	<span class="sr-only">Loading...</span>
</Card.Root>
