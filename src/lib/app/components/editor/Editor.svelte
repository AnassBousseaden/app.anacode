<script>
  import { onMount, onDestroy } from 'svelte';
  import * as monaco from 'monaco-editor';
  import { mode } from 'mode-watcher';
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
  import { cn } from '$lib/utils.js';
  import { editorSettings } from '$lib/app/components/editor/editor-settings.js';
  import { writable } from 'svelte/store';
  import { initMonacoThemesAndHighlighting } from '$lib/app/components/editor/monaco-themes.js';

  // store
  export let tabSize = $editorSettings.tabSize;
  export let fontSize = $editorSettings.fontSize;

  export let codeStore = '';
  export let changeRequest = writable(0);
  export let language = 'python';
  export let readOnly = false;
  export let fit = false;
  export let wordWrap = 'on';
  export let className = '';

  const lightTheme = 'one-light';
  const darkTheme = 'night-owl';


  $: {
    if (editor) {
      const model = editor.getModel();
      monaco.editor.setModelLanguage(model, language);
      editor.setModel(model);
    }
  }
  $ :{
    console.log('current language set:', language);
  }

  export function setEditorContent(newContent) {
    if (!editor) return;
    editor.setValue(newContent);
  }

  let editorDiv;
  let editor;
  let unsubscribe;

  const updateEditorHeight = () => {
    if (!editor || !readOnly || !fit) return;
    const padding = 50;
    const contentHeight = editor.getContentHeight();
    editorDiv.style.height = `${contentHeight + padding}px`;
    editor.layout();
  };

  self.MonacoEnvironment = {
    getWorker: function(_moduleId, label) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    }
  };

  const initMonaco = (darkMode) => {
    // monaco.editor.defineTheme('night-owl', nightOwl);
    monaco.editor.setTheme(darkMode ? darkTheme : lightTheme);

    editor = monaco.editor.create(editorDiv, {
      value: codeStore,
      language: language,
      automaticLayout: true,
      minimap: {
        enabled: false
      },
      insertSpaces: true,
      fontFamily: 'JetBrains Mono',
      tabSize: tabSize,
      scrollBeyond: false,
      fontSize: fontSize,
      fontLigatures: true,
      lineNumbers: 'on',
      roundedSelection: false,
      readOnly: readOnly,
      cursorStyle: 'line',
      wordWrap: wordWrap,
      'bracketPairColorization.enabled': true,
      rulers: []
    });

    changeRequest.subscribe(() => {
      if (editor) {
        editor.setValue(codeStore);
        editor.updateOptions({ readOnly: readOnly });
      }
    });

    editorSettings.subscribe((settings) => {
      editor?.updateOptions({
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
        detectIndentation: false,
        trimAutoWhitespace: true
      });
    });

    editor.onDidChangeModelContent(() => {
      codeStore = editor?.getValue();
      updateEditorHeight();
    });

    // Initial height update if needed
    updateEditorHeight();
  };

  onMount(async () => {
    await initMonacoThemesAndHighlighting(lightTheme, darkTheme);
    initMonaco($mode === 'dark');
    unsubscribe = mode.subscribe((currentMode) => {
      if (!editor) return;
      monaco.editor.setTheme(currentMode === 'dark' ? darkTheme : lightTheme);
    });

    const resizeObserver = new ResizeObserver(() => {
      editor?.layout();
    });

    if (editorDiv) {
      resizeObserver.observe(editorDiv);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  onDestroy(() => {
    if (editor) {
      editor.dispose();
    }
    if (unsubscribe) {
      unsubscribe();
    }
  });
</script>

<div
	class={cn("editor-container-- flex-grow overflow-hidden border-2", className)}
	{...$$restProps}
	bind:this={editorDiv}></div>
