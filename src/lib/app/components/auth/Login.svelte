<script>
  // @ts-nocheck

  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { url, logout, authStore } from '$lib/api/anacode/auth.js';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LogModal from '$lib/app/components/auth/LogModal.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { LogOut, MonitorCog, User } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { invalidateAll } from '$app/navigation';
  import { editorSettings } from '$lib/app/components/editor/editor-settings.js';

  const modalStateLogin = writable(false);
  authStore.subscribe((userData) => {
    if (userData.isAuthenticated) {
      modalStateLogin.set(false);
    }
  });

  let userInfo = $authStore;


  onMount(() => {
    authStore.subscribe(newUserInfo => {
      userInfo = newUserInfo;
    });
  });

  let performLogin = () => {
    const redirectUrl = `${url}/auth/login`;
    window.open(redirectUrl, 'LoginPopup', 'width=600,height=600');
  };

  let performLogout = async () => {
    try {
      await logout();
    } catch (err) {
      toast.error(err.message);
    }
    authStore.logout();
    toast.success('Logged out successfully');
    await invalidateAll();
  };

</script>

{#if !$authStore.isAuthenticated}
	<LogModal
		title="Sign-In"
		showModal={$modalStateLogin}
		performLogAction={performLogin}
	/>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="secondary"
				size="icon"
			>
				<User class="h-5" />

				<span class="sr-only">Toggle user menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label>
				{userInfo?.userInfo.user_name}
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="space-x-1" on:click={() => $editorSettings.isModalOpened  = true}>
				<MonitorCog />
				<div>
					Editor Settings
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="space-x-1" on:click={performLogout}>
				<LogOut />
				<div>
					Logout
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}


<style>
</style>
