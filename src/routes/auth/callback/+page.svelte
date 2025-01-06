<script>
	import { page } from '$app/stores';

	let status = 'Loading...';

	import { onMount } from 'svelte';

	/**
	 * @type {any}
	 */
	let userInfo;
	onMount(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const userInfoDump = urlParams.get('user_info');
		if (userInfoDump) {
			userInfo = JSON.parse(userInfoDump);
			localStorage.setItem('user_info', userInfoDump);
			console.log('setting the localStorage', userInfo);
			window.close();
		} else {
			status = 'No token found in callback URL.';
			console.error('No token found in callback URL.');
			window.close();
		}
	});
</script>

{#if userInfo}
	<div class="auth-login">
		<h1>Successfully logged in</h1>
		<p>{JSON.stringify(userInfo)}</p>
	</div>
{:else}
	<p>{status}</p>
{/if}

<style>
    .auth-login {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
