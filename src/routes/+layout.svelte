<script>
  import Header from './Header.svelte';
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';
  import EditorSettingsModal from '$lib/app/components/editor/EditorSettingsModal.svelte';
</script>

<svelte:head>
	<title>AnaCode</title>
	<link
		rel="icon"
		type="image/svg+xml"
		href="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='hsl(221.2,83.2%,53.3%)'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%20class='lucide%20lucide-codepen'%3E%3Cpolygon%20points='12%202%2022%208.5%2022%2015.5%2012%2022%202%2015.5%202%208.5%2012%202'%2F%3E%3Cline%20x1='12'%20x2='12'%20y1='22'%20y2='15.5'%2F%3E%3Cpolyline%20points='22%208.5%2012%2015.5%202%208.5'%2F%3E%3Cpolyline%20points='2%2015.5%2012%208.5%2022%2015.5'%2F%3E%3Cline%20x1='12'%20x2='12'%20y1='2'%20y2='8.5'%2F%3E%3C%2Fsvg%3E"
	/>
</svelte:head>

<ModeWatcher />
<EditorSettingsModal/>

<Toaster expand={true} richColors />
<div class="app-container p-2">
	<Header />
	<div class="layout-container">
		<slot />
	</div>
</div>



<style>
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
    }

    .layout-container {
        flex-grow: 1;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        overflow: hidden;
    }
</style>
