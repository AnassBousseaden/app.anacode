<script>
    import { writable } from "svelte/store";
    import Editor from "./Editor.svelte";
    import Prompt from "./Prompt.svelte";
    import EditorHeader from "./EditorHeader.svelte";
    import { pollForResult, postToJudge } from "$lib/submissions";
    import ResultBlock from "./ResultBlock.svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    const { id, title, description, examples, driver_code } = data;
    const codeStorageKey = `problem-store-${id}`;
    const initialCode =
        localStorage.getItem(codeStorageKey) == null
            ? driver_code
            : localStorage.getItem(codeStorageKey);
    // code Storage
    let codeStore = writable();
    let currentCode = "";

    codeStore.set(initialCode);

    codeStore.subscribe((newCode) => {
        localStorage.setItem(codeStorageKey, newCode);
        currentCode = newCode;
    });

    // status can be idle(no result), pending, idle(result)
    let submission = {
        status: "idle",
        token: "",
        result: "",
        error: "",
    };

    $: console.log(submission);

    // code submition
    let handleSubmit = async () => {
        if (submission.status != "idle") return;
        try {
            console.log(currentCode);
            submission.status = "pending";
            submission.token = await postToJudge(id, currentCode);
            console.log("received token:", submission.token);
            submission.result = await pollForResult(submission.token);
            console.log("reseived result :", submission.result);
        } catch (err) {
            console.error("failed because!", err);
        } finally {
            submission.status = "idle";
        }
    };
</script>

<div class="environment-container">
    <div class="enviroment-container-item">
        <Prompt {id} {title} {description} {examples} />
    </div>

    <div class="enviroment-container-item">
        <EditorHeader {handleSubmit} {submission} />
        <Editor {codeStore} />
        <ResultBlock {submission} />
    </div>
</div>

<style>
    .environment-container {
        display: flex;
        flex-direction: row;
        overflow: auto;
        width: 98%;
        height: 100%;
    }
    .enviroment-container-item {
        flex: 1;
        border: 1px solid rgb(55, 55, 133);
        overflow: auto;
        display: flex;
        flex-direction: column;
    }
</style>
