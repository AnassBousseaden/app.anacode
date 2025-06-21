<script lang="ts">
	import { page } from '$app/state';

	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button';

	const status = page.status;
	const message = page.error.message ?? 'Server error';
	const goHome = () => {
		// navigate programmatically without a full reload
		import('$app/navigation').then(({ goto }) => goto('/'));
	};

</script>

<section class="flex flex-col items-center justify-center gap-2 h-full w-full p-3">
	<Alert.Root class="w-full max-w-md">
		<Alert.Title class="text-lg font-semibold ">
			{status}
		</Alert.Title>
		<Alert.Description>
			{message}
		</Alert.Description>
	</Alert.Root>
	<div class="flex gap-4">
		<Button on:click={() => history.back()}>
			Go back
		</Button>
		<Button variant="secondary" on:click={goHome}>
			Home
		</Button>
	</div>
</section>
