<script>
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Code, FolderCode } from 'lucide-svelte';
</script>

<div class="flex shrink-0 justify-center rounded-md border border-primary border-dashed flex-grow m-4">
	<div class="flex flex-col items-center justify-center text-center m-4">
		<FolderCode />
		<h3 class="mt-4 text-lg font-semibold">No problems 😒</h3>
		<p class="text-muted-foreground mb-4 mt-2 text-sm">
			You have not created any problems.
		</p>
	</div>
</div>
