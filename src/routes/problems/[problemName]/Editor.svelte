<script>
    // @ts-nocheck

    import EditorHeader from "./EditorHeader.svelte";
    import { onMount, onDestroy } from "svelte";
    import { EditorView, basicSetup } from "codemirror";
    import { python } from "@codemirror/lang-python";
    import { oneDark } from "@codemirror/theme-one-dark";
    import { indentWithTab } from "@codemirror/commands";
    import { keymap } from "@codemirror/view";

    // export props
    export let codeStore;

    /**
     * @type {HTMLDivElement}
     */
    let editorDiv;
    /**
     * @type {EditorView}
     */
    let editor;
    const tabSize = 2;
    // Custom tab insertion function
    const insertTab = ({ state, dispatch }) => {
        dispatch(
            state.update({
                changes: { from: state.selection.main.head, insert: "  " },
                selection: { anchor: state.selection.main.head + tabSize },
            }),
        );
        return true;
    };

    // Custom extensions
    const tabHandler = EditorView.domEventHandlers({
        keydown: (event, view) => {
            if (event.key === "Tab") {
                event.preventDefault();
                return insertTab(view);
            }
        },
    });

    const customTabBehavior = keymap.of([{ key: "Tab", run: insertTab }]);

    const flexEditor = EditorView.theme({
        "&": {
            flexGrow: "1",
            height: "100%",
            overflow: "hidden",
        },
    });

    const eventListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
            codeStore.set(update.state.doc.toString());
        }
    });

    let initialCode = "  ";
    codeStore.subscribe((/** @type {string} */ code) => (initialCode = code));

    onMount(() => {
        editor = new EditorView({
            doc: initialCode,
            extensions: [
                basicSetup,
                python(),
                EditorView.lineWrapping,
                flexEditor,
                eventListener,
                oneDark,
                customTabBehavior,
                tabHandler,
            ],
            parent: editorDiv,
        });
    });
    onDestroy(() => {
        editor.destroy();
    });
</script>

<div class="editor-container" bind:this={editorDiv}></div>

<style>
    .editor-container {
        flex-grow: 1;
        overflow: hidden;
    }
</style>
