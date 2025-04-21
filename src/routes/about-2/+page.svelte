<script>
  import ExecutionContextController
    from '$lib/app/components/create/execution-context-creator/ExecutionContextController.svelte';

  export let data;
  let { languageInfo, executionContext } = data;
</script>


<ExecutionContextController
	languageInfo={languageInfo}
	executionContext={executionContext}
/>