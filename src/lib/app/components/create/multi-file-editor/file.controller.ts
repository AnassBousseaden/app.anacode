// file.controller.ts
import { get, type Writable } from 'svelte/store';
import type { Directory, File } from './file.manager';
import { writable } from 'svelte/store';

// A simple counter so new directories/files get unique names
let counter = 0;

/** Create (append) a new subdirectory inside `parentDir` */
export function createDirectory(parentDir: Writable<Directory>) {
	counter++;
	parentDir.update((dir) => {
		dir.children.push(makeDirectoryStore(`new-dir-${counter}`));
		return dir;
	});
}

// You could do this inline; parted out here for clarity:
function makeDirectoryStore(name: string): Writable<Directory> {
	return writable<Directory>({
		name,
		canDelete: true,
		canRename: true,
		isReadOnly: false,
		isSelected: false,
		files: [],
		children: []
	});
}

/** Create (append) a new file in `parentDir` */
export function createFile(parentDir: Writable<Directory>) {
	counter++;
	parentDir.update((dir) => {
		dir.files.push(makeFileStore(`new-file-${counter}.txt`));
		return dir;
	});
}

function makeFileStore(name: string): Writable<File> {
	return writable<File>({
		name,
		icon: null,
		content: '',
		canDelete: true,
		canRename: true,
		isReadOnly: false,
		isSelected: false
	});
}

/** Rename a directory (if allowed) */
export function renameDirectory(dirWritable: Writable<Directory>, newName: string) {
	dirWritable.update((dir) => {
		if (dir.canRename && !dir.isReadOnly) {
			dir.name = newName;
		}
		return dir;
	});
}

/** Rename a file (if allowed) */
export function renameFile(fileWritable: Writable<File>, newName: string) {
	fileWritable.update((f) => {
		if (f.canRename && !f.isReadOnly) {
			f.name = newName;
		}
		return f;
	});
}

export function deleteDirectory(
	parentDir: Writable<Directory> | null,
	targetDir: Writable<Directory>,
	rootDir: Writable<Directory>,
	currentFile: Writable<File> | null
): Writable<File> | null {
	if (!parentDir) return currentFile;

	parentDir.update((dir) => {
		dir.children = dir.children.filter((child) => child !== targetDir);
		return dir;
	});
	if (currentFile) {
		const isStillPresent = fileExistsInDirectory(rootDir, currentFile);
		if (!isStillPresent) {
			return findAnyFile(rootDir);
		}
	}
	return currentFile;
}

/** Delete a file from its parent, and attempt to keep currentFile relevant. */
export function deleteFile(
	parentDir: Writable<Directory>,
	targetFile: Writable<File>,
	rootDir: Writable<Directory>,
	currentFile: Writable<File> | null
): Writable<File> | null {
	parentDir.update((dir) => {
		dir.files = dir.files.filter((f) => f !== targetFile);
		return dir;
	});

	if (currentFile && targetFile === currentFile) {
		return findAnyFile(rootDir);
	} else {
		return currentFile;
	}
}

/**
 * Select a directory: mark old one not selected, new one selected, etc.
 * `return` the newly selected directory store if needed.
 */
export function selectDirectory(
	dirToSelect: Writable<Directory>,
	currentDirectory: Writable<Directory> | null
): Writable<Directory> {
	if (currentDirectory) {
		currentDirectory.update((dir) => {
			dir.isSelected = false;
			return dir;
		});
	}
	dirToSelect.update((dir) => {
		dir.isSelected = true;
		return dir;
	});
	return dirToSelect;
}

/**
 * Select a file: mark old one not selected, new one selected, etc.
 * Returns the newly-selected file so your UI can set `currentFile`.
 */
export function selectFile(
	directoryWritable: Writable<Directory>,
	fileWritable: Writable<File>,
	currentFile: Writable<File> | null
): Writable<File> {
	// unselect old file
	if (currentFile) {
		currentFile.update((f) => {
			f.isSelected = false;
			return f;
		});
	}

	// select new file
	fileWritable.update((f) => {
		f.isSelected = true;
		return f;
	});
	return fileWritable;
}

/** Check if a given `file` store is anywhere under `dir` (recursively). */
function fileExistsInDirectory(
	dirWritable: Writable<Directory>,
	fileWritable: Writable<File>
): boolean {
	const dir = get(dirWritable);
	// check direct files
	if (dir.files.includes(fileWritable)) return true;
	// check children
	for (const childDir of dir.children) {
		if (fileExistsInDirectory(childDir, fileWritable)) {
			return true;
		}
	}
	return false;
}

export function findAnyFile(rootDir: Writable<Directory>): Writable<File> | null {
	const queue: Writable<Directory>[] = [rootDir];
	while (queue.length > 0) {
		const current = queue.shift()!;
		const curVal = get(current);
		if (curVal.files.length > 0) {
			const result = curVal.files[0];
			result.update((file) => {
				file.isSelected = true;
				return file;
			});
			return result;
		}
		// add children to queue
		for (const c of curVal.children) {
			queue.push(c);
		}
	}
	return null;
}
