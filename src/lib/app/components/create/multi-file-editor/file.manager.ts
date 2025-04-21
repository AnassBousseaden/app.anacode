import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

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

	// optional if you want the DirectoryComponent to handle its own rename
	onRenameDirectory?(directoryWritable: Writable<Directory>): void;
}

// Simple factory for a new Directory
export function newDirectory(
	name: string,
	canDelete: boolean,
	canRename: boolean,
	isReadOnly: boolean,
	isSelected: boolean
): Writable<Directory> {
	return writable<Directory>({
		name,
		canDelete,
		canRename,
		isReadOnly,
		isSelected,
		files: [],
		children: []
	});
}

export interface DirectoryContextMenuEvent {
	parent: Writable<Directory> | null; // null means top-level
	node: Writable<Directory>;
}

export interface FileContextMenuEvent {
	parent: Writable<Directory>;
	node: Writable<File>;
}
