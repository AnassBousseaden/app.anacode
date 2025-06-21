<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Clock, ServerOff } from 'lucide-svelte';

	export let errorMessage;
</script>

<Card.Root
	class="items-center justify-center flex flex-col h-full w-full border-4 border-secondary"
	role="status"
	aria-busy="true"
	aria-live="polite"
>
	<!--  Error content -->
	<div class="flex flex-col items-center justify-center gap-4 p-6 text-center">
		<ServerOff class="w-12 h-12 text-secondary-foreground" />

		<div class="space-y-2">
			<h3 class="text-xl font-semibold text-secondary-foreground">Server Error</h3>
			{#if errorMessage !== null}
				<p class="text-muted-foreground">{errorMessage}</p>
			{/if}
		</div>

		<div class="mt-2 w-16 h-1 bg-secondary rounded-full opacity-75"></div>
	</div>
</Card.Root>
