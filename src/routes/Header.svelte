<script>
  import Code from 'lucide-svelte/icons/code-2';
  import Login from '$lib/app/components/auth/Login.svelte';
  import { base } from '$app/paths';
  import { toggleMode } from 'mode-watcher';
  import { Moon, Sun } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import { page } from '$app/state';
</script>

<div class="flex mb-2 w-full flex-col ">
	<header class="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="{base}/problems" class="flex items-center gap-6 font-semibold md:text-base">
				<Code class="h-6 w-6 text-primary" />
			</a>
		</nav>
		<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<a
				href="{base}/my-problems"
				class={cn(
					"text-sm font-medium transition-colors gap-6",
						page.url.pathname === `${base}/my-problems`
						? "text-primary font-semibold"
						: "text-muted-foreground hover:text-primary"
  		)}>
				Create
			</a>

			<form class="ml-auto flex-1 sm:flex-initial">
			</form>
			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<Login />
		</div>
	</header>
</div>


<slot />