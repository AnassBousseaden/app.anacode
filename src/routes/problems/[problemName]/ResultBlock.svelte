<script>
    export let submission;
    console.log(submission);
</script>

{#if submission.result.stderr}
    <pre><code>{submission.result.stderr}</code></pre>
{/if}
