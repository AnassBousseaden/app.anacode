<script>
	import Code from 'lucide-svelte/icons/code-2';
	import Login from './Login.svelte';
	import { base } from '$app/paths';
</script>

<div class="flex mb-2 w-full flex-col ">
	<header class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="{base}/problems" class="flex items-center gap-2 text-lg font-semibold md:text-base">
				<Code class="h-6 w-6" />
			</a>
		</nav>
		<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<form class="ml-auto flex-1 sm:flex-initial">
			</form>
			<Login />
		</div>
	</header>
</div>


<slot />