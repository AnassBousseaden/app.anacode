<script>
    export let description;
    description = description.split(/\r?\n/);
</script>

<div class="description">
    {#each description as paragraph}
        <p>{paragraph}</p>
    {/each}
</div>
