<script>
    import ProblemPreview from "./ProblemPreview.svelte";
    export let data;
    const { problems } = data;
</script>

<div class="problem-list-container">
    <h1 class="problem-list-header">Problem List</h1>
    <h2 class="problem-name">Problem name</h2>
    {#each problems as { id, title }}
        <ProblemPreview {id} {title}></ProblemPreview>
    {/each}
</div>

<style>
    .problem-list-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        max-width: 1400px;
    }
</style>
