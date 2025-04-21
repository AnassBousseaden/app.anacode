import type { Language, PrivateExecutionContext } from '$lib/api/anacode/models';
import type { File, Directory } from '$lib/app/components/create/multi-file-editor/file.manager';
import { newDirectory } from '$lib/app/components/create/multi-file-editor/file.manager';
import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import JSZip from 'jszip';
import { toast } from 'svelte-sonner';

/**
 * Manages file-related operations within a given execution context.
 *
 * Central Management Point for file related operations related to an {@link PrivateExecutionContext}.
 *
 *
 * @class
 */
export class ExecutionContextFileManager {
	readonly executionContext: PrivateExecutionContext;
	readonly languageInfo: Language;

	rootDirectory: Writable<Directory> = null;
	solutionFile: Writable<File> = null;

	constructor(initialExecutionContext: PrivateExecutionContext, languageInfo: Language) {
		this.executionContext = initialExecutionContext;
		this.languageInfo = languageInfo;
	}

	async init() {
		const [directory, solutionFile] = await initializeExecutionContextDirectory(
			this.executionContext,
			this.languageInfo
		);
		this.rootDirectory = directory;
		this.solutionFile = solutionFile;
	}

	get solutionFileWritable() {
		return this.solutionFile;
	}
}

export async function initializeExecutionContextDirectory(
	executionContext: PrivateExecutionContext,
	languageInfo: Language
): Promise<[Writable<Directory>, Writable<File>]> {
	let mainFile: File = {
		name: languageInfo.source_file,
		icon: null,
		content: executionContext.main_code,
		canDelete: false,
		canRename: false,
		isReadOnly: false,
		isSelected: false
	};
	let solutionFileWritable: Writable<File> = writable({
		name: languageInfo.solution_file,
		icon: null,
		content: executionContext.driver_code,
		canDelete: false,
		canRename: false,
		isReadOnly: true,
		isSelected: false
	});
	let additionalFiles: string = executionContext.additional_files;
	return [
		await buildDirectoryStructure(mainFile, solutionFileWritable, additionalFiles),
		solutionFileWritable
	];
}

/**
 * Builds a directory structure from main file, solution file, and additional files
 * @param mainFile The main file for the project
 * @param solutionFileWritable The solution file as a svelte writable
 * @param additionalFilesBase64 Base64 encoded ZIP file containing additional files
 * @returns A writable store containing the root directory
 */
export async function buildDirectoryStructure(
	mainFile: File,
	solutionFileWritable: Writable<File>,
	additionalFilesBase64?: string
): Promise<Writable<Directory>> {
	// Create the root directory named 'box'
	const rootDirectory = newDirectory('box', false, false, false, true);

	// Add main file and solution file to the root directory
	const mainFileWritable = writable<File>(mainFile);

	rootDirectory.update((dir) => {
		dir.files.push(mainFileWritable);
		dir.files.push(solutionFileWritable);
		return dir;
	});

	// If additional files are provided, process the zip
	if (additionalFilesBase64) {
		try {
			// Convert base64 to binary
			const binaryString = atob(additionalFilesBase64);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			// Load the zip
			const zip = await JSZip.loadAsync(bytes.buffer);

			// Process all files in the zip
			await processZipFiles(zip, rootDirectory);
		} catch (error) {
			console.error('Error processing additional files:', error);
		}
	}
	return rootDirectory;
}

/**
 * Process files from a JSZip object and add them to the directory structure
 * @param zip The JSZip object containing files
 * @param rootDirectory The root directory to add files to
 */
async function processZipFiles(zip: JSZip, rootDirectory: Writable<Directory>): Promise<void> {
	const root = get(rootDirectory);
	const dirMap = new Map<string, Writable<Directory>>();
	dirMap.set('', rootDirectory);

	// First pass: create all directories
	for (const filePath in zip.files) {
		if (zip.files[filePath].dir) {
			const pathParts = filePath.split('/').filter((part) => part !== '');
			let currentPath = '';
			let parentDir = rootDirectory;

			for (const dirName of pathParts) {
				const prevPath = currentPath;
				currentPath = currentPath ? `${currentPath}/${dirName}` : dirName;

				if (!dirMap.has(currentPath)) {
					// Create new directory
					const newDir = newDirectory(dirName, true, true, false, false);

					// Add to parent
					dirMap.get(prevPath)!.update((dir) => {
						dir.children.push(newDir);
						return dir;
					});

					// Store in map
					dirMap.set(currentPath, newDir);
				}

				parentDir = dirMap.get(currentPath)!;
			}
		}
	}

	// Second pass: add all files
	for (const filePath in zip.files) {
		if (!zip.files[filePath].dir) {
			const pathParts = filePath.split('/');
			const fileName = pathParts.pop()!;
			const dirPath = pathParts.join('/');

			// Get content
			const content = await zip.files[filePath].async('string');

			// Create file object
			const fileObj: File = {
				name: fileName,
				icon: null, // You may want to set this based on file extension
				content: content,
				canDelete: true,
				canRename: true,
				isReadOnly: false,
				isSelected: false
			};

			// Add to parent directory
			const parentDir = dirMap.get(dirPath) || rootDirectory;
			parentDir.update((dir) => {
				dir.files.push(writable(fileObj));
				return dir;
			});
		}
	}
}

/**
 * Interface for the result of extracting directory structure
 */
export interface DirectoryExtractionResult {
	mainFile: File;
	solutionFile: File;
	additionalFilesBase64: string;
}

/**
 * Extracts mainFile, solutionFile, and additional files from a directory structure
 * @param rootDirectory The root directory writable store
 * @param mainFileName Name of the main file (default: 'main.ts')
 * @param solutionFileName Name of the solution file (default: 'solution.ts')
 * @returns Promise with extraction result containing mainFile, solutionFile and additionalFilesBase64
 */
export async function extractDirectoryStructure(
	rootDirectory: Writable<Directory>,
	mainFileName: string = 'main.ts',
	solutionFileName: string = 'solution.ts'
): Promise<DirectoryExtractionResult> {
	const root = get(rootDirectory);

	// Find main file and solution file in the root directory
	let mainFile: File | null = null;
	let solutionFile: File | null = null;

	for (const fileWritable of root.files) {
		const file = get(fileWritable);
		if (file.name === mainFileName) {
			mainFile = { ...file };
		} else if (file.name === solutionFileName) {
			solutionFile = { ...file };
		}
	}

	// Ensure both files were found
	if (!mainFile || !solutionFile) {
		throw new Error(
			`Missing required files: ${!mainFile ? mainFileName : ''} ${!solutionFile ? solutionFileName : ''}`
		);
	}

	// Create a new zip file for additional files
	const zip = new JSZip();

	// Add all files except main and solution to the zip
	await addDirectoryContentsToZip(zip, root, '', [mainFileName, solutionFileName]);

	// Generate base64 string from zip
	const zipContent = await zip.generateAsync({
		type: 'base64',
		compression: 'DEFLATE',
		compressionOptions: {
			level: 9
		}
	});

	return {
		mainFile,
		solutionFile,
		additionalFilesBase64: zipContent
	};
}

/**
 * Recursively adds directory contents to a JSZip object
 * @param zip The JSZip object to add files to
 * @param directory The directory to process
 * @param currentPath The current path within the zip
 * @param excludeFiles Array of filenames to exclude
 */
async function addDirectoryContentsToZip(
	zip: JSZip,
	directory: Directory,
	currentPath: string,
	excludeFiles: string[]
): Promise<void> {
	// Add files from current directory
	for (const fileWritable of directory.files) {
		const file = get(fileWritable);

		// Skip excluded files in the root directory
		if (currentPath === '' && excludeFiles.includes(file.name)) {
			continue;
		}

		// Add file to zip
		const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
		zip.file(filePath, file.content);
	}

	// Process subdirectories recursively
	for (const dirWritable of directory.children) {
		const dir = get(dirWritable);
		const dirPath = currentPath ? `${currentPath}/${dir.name}` : dir.name;

		// Create directory in zip (if it has content)
		if (dir.files.length > 0 || dir.children.length > 0) {
			zip.folder(dirPath);

			// Process contents recursively
			await addDirectoryContentsToZip(zip, dir, dirPath, excludeFiles);
		}
	}
}
