import { writable } from 'svelte/store';
import { localStorageJsonWritable } from '$lib/app/utils.js';


export let editorSettings = localStorageJsonWritable('editor-settings',{
  isModalOpened:false,
  tabSize: 2,
  fontSize: 16,
  }
);
