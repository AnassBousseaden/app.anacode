<script>

  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { getUserInfo } from '$lib/api/anacode/api.anacode.ts';
  import { authStore } from '$lib/api/anacode/auth.js';

  onMount(async () => {
    try {
      let userInfo = await getUserInfo();
      authStore.setAuth(userInfo);
      window.close();
    } catch (err) {
      toast.error(err.message);
      setTimeout(
        () => window.close(),
        2_500
      );
    }
  });
</script>

<style>
</style>
