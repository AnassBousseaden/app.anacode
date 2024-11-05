<script>
    export let id, title;
    import { base } from '$app/paths';
</script>

<div class="problem-preview">
    <a href="{base}/problems/{id}">{title}</a>
</div>
