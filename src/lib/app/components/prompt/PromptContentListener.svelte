<script>

  import PromptContent from '$lib/app/components/prompt/PromptContent.svelte';

  export let titleWritable;
  export let descriptionWritable;
  export let examplesWritable;
  export let difficultyWritable;
  export let language_name;


</script>


<PromptContent
	title={$titleWritable}
	description={$descriptionWritable}
	difficulty={$difficultyWritable}
	examples={$examplesWritable}
	language_name={language_name}
/>