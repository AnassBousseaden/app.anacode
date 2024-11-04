<script>
    import Description from "./Description.svelte";
    import Example from "./Example.svelte";

    export let id;
    export let title;
    export let description;
    export let examples;
</script>

<div class="question-container">
    <h2 class="prompt-title"><strong>{title}</strong></h2>
    <Description {description}></Description>
    {#each examples as { input, output }, offset}
        <Example {offset} {input} {output}></Example>
    {/each}
</div>

<style>
    .question-container {
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex-grow: 1;
    }
    .prompt-title {
        font-size: 2rem;
    }
</style>
