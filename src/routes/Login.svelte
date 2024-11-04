<script>
    // @ts-nocheck

    import LoginModal from "./LoginModal.svelte";
    import { url, userInfoKey } from "$lib/auth";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    // Create a store for modal state
    const modalState = writable(false);

    /**
     * @type {string | null}
     */
    let userInfo;

    function handleStorageChange(event) {
        if (event.key === userInfoKey) {
            userInfo = event.newValue;
            modalState.set(false);
        }
    }

    onMount(() => {
        userInfo = localStorage.getItem(userInfoKey);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    });

    let performLogin = () => {
        const redirectUrl = `${url}/auth/login`;
        window.open(redirectUrl, "LoginPopup", "width=600,height=600");
    };
</script>

{#if !userInfo}
    <button class="login-button" on:click={() => modalState.set(true)}>
        Sign-in
    </button>
{:else}
    <div class="user-info">
        {JSON.parse(userInfo).login}
    </div>
{/if}

<LoginModal
    showModal={$modalState}
    {performLogin}
    setModalState={(state) => modalState.set(state)}
/>

<style>
    .login-button {
        display: block;
    }
    .user-info {
        display: block;
        align-content: center;
        font-weight: 700;
    }
</style>
