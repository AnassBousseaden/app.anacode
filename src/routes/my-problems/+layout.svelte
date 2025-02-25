<script>
  import { authStore } from '$lib/api/anacode/auth.js';
  import { invalidateAll } from '$app/navigation';
  import { writable } from 'svelte/store';
  import LogInRelay from '$lib/app/components/auth/LogInRelay.svelte';

  let isAuthenticated = writable($authStore.isAuthenticated);

  authStore.subscribe(async (newValue) => {
    if ($isAuthenticated !== newValue.isAuthenticated) {
      console.log('layout detected new value loaded: ', JSON.stringify(newValue));
      await invalidateAll();
      $isAuthenticated = newValue.isAuthenticated;
    }
  });


</script>
{#if $authStore.isAuthenticated}
	<slot />
{:else}
	<LogInRelay />
{/if}


<style></style>


