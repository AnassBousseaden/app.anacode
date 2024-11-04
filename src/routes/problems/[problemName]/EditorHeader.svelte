<script>
    export let handleSubmit;
    export let submission;
</script>

<div class="editor-header">
    <button on:click={handleSubmit}>Submit</button>
    <div class="status-header">{submission.status}</div>
</div>

<style>
    .editor-header {
        display: flex;
        justify-content: space-between;
    }
</style>
