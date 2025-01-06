<script lang="js">
	// @ts-nocheck
	import { onMount, onDestroy } from 'svelte';
	import { EditorView, basicSetup } from 'codemirror';
	import { python } from '@codemirror/lang-python';
	import { keymap } from '@codemirror/view';
	import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
	import { mode } from 'mode-watcher';
	import { StateEffect } from '@codemirror/state';

	// export props
	export let codeStore = "";

	let editorDiv;
	let editor;
	let unsubscribe;
	const tabSize = 2;
	// Custom tab insertion function
	const insertTab = ({ state, dispatch }) => {
		dispatch(
			state.update({
				changes: { from: state.selection.main.head, insert: '  ' },
				selection: { anchor: state.selection.main.head + tabSize }
			})
		);
		return true;
	};

	// Custom extensions
	const tabHandler = EditorView.domEventHandlers({
		keydown: (event, view) => {
			if (event.key === 'Tab') {
				event.preventDefault();
				return insertTab(view);
			}
		}
	});

	const customTabBehavior = keymap.of([{ key: 'Tab', run: insertTab }]);

	const flexEditor = EditorView.theme({
		'&': {
			flexGrow: '1',
			height: '100%',
			overflow: 'hidden'
		}
	});

	const eventListener = EditorView.updateListener.of((update) => {
		if (update.docChanged) {
			codeStore = update.state.doc.toString();
		}
	});

	onMount(() => {
		editor = new EditorView({
			doc: codeStore,
			extensions: [
				basicSetup,
				python(),
				EditorView.lineWrapping,
				$mode === 'dark' ? githubDark : githubLight,
				flexEditor,
				eventListener,
				customTabBehavior,
				tabHandler
			],
			parent: editorDiv
		});

		unsubscribe = mode.subscribe((currentMode) => {
			if (!editor) return;

			editor.dispatch({
				effects: StateEffect.reconfigure.of([
					basicSetup,
					python(),
					EditorView.lineWrapping,
					currentMode === 'dark' ? githubDark : githubLight,
					flexEditor,
					eventListener,
					customTabBehavior,
					tabHandler
				])
			});
		});

	});
	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div class="flex-grow overflow-hidden border-2" bind:this={editorDiv}></div>
