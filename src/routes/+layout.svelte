<script>
	import Header from './Header.svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
</script>


<ModeWatcher></ModeWatcher>

<Header />


<div class="layout-container">
	<slot />
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
