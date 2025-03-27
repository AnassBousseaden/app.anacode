<script>
  import { Button } from '$lib/components/ui/button/index.js';
  import { PartyPopper, PenSquare, Search } from 'lucide-svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';

  export let showSuccessModal;
  export let backToProblem;
  export let viewProblem;

</script>

<Dialog.Root
	bind:open={$showSuccessModal}
	closeOnOutsideClick={false}
	closeOnEscape={false}
>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>
        <span class="flex items-center gap-2">
          <PartyPopper size={20} /> Problem Published!
        </span>
			</Dialog.Title>
			<Dialog.Description>
				Your problem is now live. What would you like to do next?
			</Dialog.Description>
		</Dialog.Header>
		<Button onclick={backToProblem}>
			<PenSquare size={16} class="mr-2" />
			Back To My Problems
		</Button>
		<Button onclick={viewProblem}>
			<Search size={16} class="mr-2" />
			View Problem
		</Button>
	</Dialog.Content>
</Dialog.Root>
