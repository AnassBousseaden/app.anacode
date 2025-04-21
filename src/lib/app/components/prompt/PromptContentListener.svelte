<script>

  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';

  export let titleWritable;
  export let descriptionWritable;
  export let examplesWritable;
  export let difficultyWritable;

</script>


<PromptContent
	title={$titleWritable}
	description={$descriptionWritable}
	difficulty={$difficultyWritable}
	examples={$examplesWritable}
/>