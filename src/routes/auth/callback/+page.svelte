<script>
    // Limitations: this page should also validate that auth_cookie is set properly but since the cookie is
    // marked as http only the only way to validate it is to make a request to an authenticated backend endpoint
    // so i could setup a dummy "/.../validate-session" endpoint just for this.

    import { page } from "$app/stores";
    import { onMount } from "svelte";
    /**
     * @type {any}
     */
    let userInfo;

    onMount(() => {
        const urlParams = new URLSearchParams($page.url.search);
        const userInfoDump = urlParams.get("user_info");
        if (userInfoDump) {
            userInfo = JSON.parse(userInfoDump);
            localStorage.setItem("user_info", userInfoDump);
            console.log("setting the localStorage", userInfo);
            window.close();
        } else {
            console.error("No token found in callback URL.");
        }
    });
</script>

{#if userInfo}
    <div class="auth-login">
        <h1>Successfully logged in</h1>
        <p>{JSON.stringify(userInfo)}</p>
    </div>
{:else}
    <p>Something went wrong...</p>
{/if}

<style>
    .auth-login {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>
