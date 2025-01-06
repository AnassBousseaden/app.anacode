<script>
	// @ts-nocheck

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { url, userInfoKey, logout } from '$lib/api/anacode/auth.js';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import LogModal from '$lib/app/components/auth/LogModal.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import { User, UserCheck, UserCog } from 'lucide-svelte';

	const modalStateLogin = writable(false);
	const modalStateLogout = writable(false);

	/**
	 * @type {string | null}
	 */
	let userInfo;

	function handleStorageChange(event) {
		if (event.key === userInfoKey) {
			userInfo = event.newValue;
			modalStateLogin.set(false);
		}
	}

	onMount(() => {
		userInfo = localStorage.getItem(userInfoKey);
		window.addEventListener('storage', handleStorageChange);
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	});

	let performLogin = () => {
		const redirectUrl = `${url}/auth/login`;
		window.open(redirectUrl, 'LoginPopup', 'width=600,height=600');
	};

	let performLogout = async () => {
		try {
			await logout();
		} catch (e) {
			console.log('unable to perform logout towards server', e);
		}
		localStorage.removeItem(userInfoKey);
		modalStateLogout.set(false);
		userInfo = localStorage.getItem(userInfoKey);
	};

</script>

{#if !userInfo}
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
				<User class="h-5 w-5" />
				<span class="sr-only">Toggle user menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Label>{JSON.parse(userInfo).login}</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item on:click={performLogout()}>Logout</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}


<style>
</style>
