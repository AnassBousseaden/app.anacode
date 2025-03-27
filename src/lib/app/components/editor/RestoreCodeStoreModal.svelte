<script>
  import { Button } from '$lib/components/ui/button';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
  } from '$lib/components/ui/dialog';

  export let open = false;
  export let handleConfirm;

  function handleConfirmInternal() {
    handleConfirm();
    open = false;
  }

</script>

<Dialog bind:open={open}>
	<DialogContent class="sm:max-w-md">
		<DialogHeader>
			<DialogTitle>Restore code ?</DialogTitle>
			<DialogDescription>
				Your current code will be discarded and reset to the default code!
			</DialogDescription>
		</DialogHeader>
		<DialogFooter class="flex">
			<Button varial class="flex-1 justify-center" on:click={handleConfirmInternal}>Confirm</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>