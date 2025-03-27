import type { PrivateExecutionContext } from '$lib/api/anacode/models';
import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { file } from 'jszip';
import { undefined } from 'zod';

export interface File {
	name: string;
	icon: any;
	content: string;
	canDelete: boolean;
	canRename: boolean;
	isReadOnly: boolean;
	isSelected: boolean;
}

export interface FileComponent {
	fileWritable: Writable<File>;

	onSelectFile(fileWritable: Writable<File>): void;

	onDeleteFile(fileWritable: Writable<File>): void;
}

export interface Directory {
	name: string;
	canDelete: boolean;
	canRename: boolean;
	isReadOnly: boolean;
	isSelected: boolean;
	files: Writable<File>[];
	children: Writable<Directory>[];
}

export interface DirectoryComponent {
	directory: Writable<Directory>;

	onSelectFile(selectedDir: Writable<Directory>, fileWritable: Writable<File>): void;

	onDeleteFile(directoryWritable: Writable<Directory>, fileWritable: Writable<File>): void;

	onSelectDirectory(dirSelected: Writable<Directory>): void;
}

export function newDirectory(
	name: string,
	canDelete: boolean,
	canRename: boolean,
	isReadOnly: boolean,
	isSelected: boolean
): Writable<Directory> {
	return writable<Directory>({
		name: name,
		canDelete: canDelete,
		canRename: canRename,
		isReadOnly: isReadOnly,
		files: [],
		children: [],
		isSelected: isSelected
	});
}

var counter = 0;

export function addNewDirectory(dirWritable: Writable<Directory>): void {
	counter++;
	const dir = get(dirWritable);
	const newDir: Directory = {
		canDelete: true,
		canRename: true,
		isReadOnly: false,
		name: `new-dir-${counter}`,
		files: [],
		children: [],
		isSelected: false
	};
	dir.children.push(writable(newDir));
	dirWritable.update((dir) => dir);
}

export function addNewFile(dirWritable: Writable<Directory>): void {
	counter++;
	const dir = get(dirWritable);
	const newFile: File = {
		canDelete: true,
		canRename: true,
		content: '',
		icon: undefined,
		isReadOnly: false,
		isSelected: false,
		name: `new-file-${counter}.${'txt'}`
	};
	dir.files.push(writable(newFile));
	dirWritable.update((dir) => dir);
}

export function deleteDirectory(
	dirWritable: Writable<Directory>,
	dirToDelete: Writable<Directory>
): void {
	const dir = get(dirWritable);
	const length = dir.children.length;
	dir.children = dir.children.filter((child: Writable<Directory>) => {
		return child != dirToDelete;
	});
	const updatedLength = dir.children.length;
	if (updatedLength < length) {
		dirWritable.update((dir) => dir);
		return;
	}
	for (const childDirWritable of this.children) {
		childDirWritable.deleteDirectory(childDirWritable, dirToDelete);
	}
}

export function deleteFile(dirWritable: Writable<Directory>, fileWritable: Writable<File>): void {
	const dir: Directory = get(dirWritable);
	const length = dir.files.length;
	dir.files = dir.files.filter((childWritable: Writable<File>) => {
		return childWritable != fileWritable;
	});
	const updatedLength = dir.files.length;
	if (updatedLength < length) {
		dirWritable.update((dir) => dir);
		return;
	}
	for (const childDirWritable of dir.children) {
		deleteFile(childDirWritable, fileWritable);
	}
}

export class EditorManager {
	public root: Writable<Directory>;
	public currentFile: Writable<File> | null;
	public currentDirectory: Writable<Directory>;
}
