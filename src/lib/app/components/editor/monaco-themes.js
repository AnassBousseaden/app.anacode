// lib/monaco-shiki.ts -------------------------------------------------
import * as monaco from 'monaco-editor';
import nightOwl from 'monaco-themes/themes/Night Owl.json';
import tomorrowTheme from 'monaco-themes/themes/Tomorrow.json';
import { registerRulesForLanguage } from 'monaco-ace-tokenizer';
import OcamlHighlightRules from 'monaco-ace-tokenizer/lib/ace/definitions/ocaml.js';

export async function initMonacoThemesAndHighlighting(lightTheme, darkTheme) {
	monaco.languages.register({ id: 'ocaml' });
	registerRulesForLanguage('ocaml', new OcamlHighlightRules());
	monaco.editor.defineTheme(darkTheme, nightOwl);
	monaco.editor.defineTheme(lightTheme, tomorrowTheme);
}
