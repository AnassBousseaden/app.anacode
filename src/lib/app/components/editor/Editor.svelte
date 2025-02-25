<script>
  import { onMount, onDestroy } from 'svelte';
  import * as monaco from 'monaco-editor';
  import { mode } from 'mode-watcher';
  import nightOwl from 'monaco-themes/themes/Night Owl.json';
  import tomorrowTheme from 'monaco-themes/themes/Tomorrow.json';
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

  export let codeStore = '';
  export let fontSize = 17;
  export let language = 'python';
  export let tabSize = 2;
  export let readOnly = false;
  export let fit = false;
  export let wordWrap = 'on';

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
      console.log(label);
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
    monaco.editor.defineTheme('night-owl', nightOwl);
    monaco.editor.defineTheme('tomorrow', tomorrowTheme);
    monaco.editor.setTheme(darkMode ? 'night-owl' : 'tomorrow');

    editor = monaco.editor.create(editorDiv, {
      value: codeStore,
      language: language,
      automaticLayout: true,
      minimap: {
        enabled: false
      },
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

    editor.onDidChangeModelContent(() => {
      codeStore = editor.getValue();
      updateEditorHeight();
    });

    // Initial height update if needed
    updateEditorHeight();
  };

  onMount(async () => {
    initMonaco($mode === 'dark');
    console.log('init finish');

    unsubscribe = mode.subscribe((currentMode) => {
      if (!editor) return;
      monaco.editor.setTheme(currentMode === 'dark' ? 'night-owl' : 'tomorrow');
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

<div class="flex-grow overflow-hidden border-2" bind:this={editorDiv}></div>
