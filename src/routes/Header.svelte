<script>
  import Code from 'lucide-svelte/icons/code-2';
  import Login from '$lib/app/components/auth/Login.svelte';
  import { base } from '$app/paths';
  import { toggleMode } from 'mode-watcher';
  import { CodepenIcon, Moon, Sun } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { cn } from '$lib/utils.js';
  import { page } from '$app/state';
  import { Separator } from '$lib/components/ui/separator/index.js';
</script>

<div class="flex mb-2 w-full flex-col">
	<header class="bg-background sticky top-0 flex h-16 items-center gap-2 border-b px-4 md:px-6">

		<a href="{base}/problems"
			 class="flex items-center font-semibold md:text-base">
			<CodepenIcon class="h-6 w-6 text-primary" />
		</a>


		<Button
			as="a"
			href={`${base}/problems`}
			variant="link"
			class={cn(
    "text-sm font-medium gap-4",
    page.url.pathname.startsWith(`${base}/problems`)
      ? "text-primary underline underline-offset-4"
      : "text-muted-foreground hover:text-primary"
  )}
		>
			Problems
		</Button>

		<Separator orientation="vertical" class="h-6" />

		<Button
			as="a"
			href={`${base}/my-problems`}
			variant="link"
			class={cn(
    "text-sm font-medium gap-4",
    page.url.pathname.startsWith(`${base}/my-problems`)
      ? "text-primary underline underline-offset-4"
      : "text-muted-foreground hover:text-primary"
  )}
		>
			Create
		</Button>

		<!-- Right-aligned items -->
		<div class="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<Button on:click={toggleMode} variant="ghost" size="icon" class="text-muted-foreground">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>

			<Separator orientation="vertical" class="h-6" />

			<Login />
		</div>
	</header>
</div>
