<script>
    // @ts-nocheck

    export let performLogin;
    export let showModal;
    export let setModalState;

    /**
     * @type {HTMLDialogElement}
     */
    let dialog;

    $: if (dialog) {
        if (showModal) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }

    function handleClose() {
        setModalState(false);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
    class="login-modal"
    bind:this={dialog}
    on:close={handleClose}
    on:click|self={() => dialog.close()}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click|stopPropagation>
        <h1>Sign In</h1>
        <hr />
        <ol class="definition-list">
            <li>
                <button on:click={performLogin}>mock auth</button>
            </li>
        </ol>
        <hr />
        <!-- svelte-ignore a11y-autofocus -->
        <button autofocus on:click={() => dialog.close()}>close modal</button>
    </div>
</dialog>

<style>
    .login-modal {
        max-width: 32em;
        border-radius: 0.2em;
        border: none;
        min-width: 50%;
        padding: 0;
    }
    .login-modal::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    .login-modal > div {
        padding: 1em;
    }
    .login-modal[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    .login-modal[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
