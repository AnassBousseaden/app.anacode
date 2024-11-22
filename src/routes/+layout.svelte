<script>
	import Header from './Header.svelte';
	import '../app.css';
</script>

<Header></Header>
<div class="layout-container">
	<slot></slot>
</div>

<style>
    .layout-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90vh;
        width: 100vw;
    }
</style>
