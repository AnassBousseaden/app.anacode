<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { ServerOff } from 'lucide-svelte';
</script>

<Card.Root
	class="items-center justify-center flex flex-col h-full w-full border-4 border-secondary"
	role="status"
	aria-busy="true"
	aria-live="polite"
>
	<!--  timeout content -->
	<div class="flex flex-col items-center justify-center gap-4 p-6 text-center">
		<ServerOff class="w-12 h-12 text-secondary-foreground" />

		<div class="space-y-2">
			<h3 class="text-xl font-semibold text-secondary-foreground">Client Timeout</h3>
			<p class="text-muted-foreground">Server Unresponsive</p>
		</div>

		<div class="mt-2 w-16 h-1 bg-secondary rounded-full opacity-75"></div>
	</div>
	<span class="sr-only">Client Timeout</span>
</Card.Root>
