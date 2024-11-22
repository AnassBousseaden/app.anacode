<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { userInfoKey } from '$lib/api/anacode/auth.js';

	let data;
	onMount(() => {
		data = localStorage.getItem(userInfoKey);
		data = JSON.parse(data);
		data = JSON.stringify(data, null, 2);
	});
</script>

{#if data}
	<pre><code>{data}</code></pre>
{/if}
