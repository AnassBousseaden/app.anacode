import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import JSZip from 'jszip';
import type { PrivateExecutionContext, Language } from '$lib/api/anacode/models';

/**
 * FileManager handles multi-file editing for a single execution context:
 * - Tracks main_code, driver_code, additional files
 * - Integrates with MultiFileEditor via `fileList` store
 * - Serializes to/from the API's PrivateExecutionContext shape
 */
export default class FileManager {
	private languageInfo: Language;
	private executionContext: PrivateExecutionContext;
	private mainFileIndex = 0;
	private solutionFileIndex = 1;
	private fileCounter = 0;

	// Svelte store of file entries: [main_code, driver_code, additional...]
	public fileList: Writable<
		Array<{
			fileName: string;
			fileContent: string;
			canChangeName: boolean;
			canDelete: boolean;
			isReadOnly: boolean;
		}>
	>;

	constructor(languageInfo: Language, executionContext: PrivateExecutionContext) {
		this.languageInfo = languageInfo;
		this.executionContext = executionContext;

		// initialize with main and solution entries matching original flags
		this.fileList = writable([
			{
				fileName: languageInfo.source_file,
				fileContent: executionContext.main_code,
				canChangeName: false,
				canDelete: false,
				isReadOnly: false
			},
			{
				fileName: languageInfo.solution_file,
				fileContent: executionContext.driver_code,
				canChangeName: false,
				canDelete: false,
				isReadOnly: true
			}
		]);
	}

	/**
	 * Load existing additional files from ZIP base64
	 */
	public async init(): Promise<this> {
		const zip64 = this.executionContext.additional_files || '';
		const extra = await FileManager.decodeBase64ZipToFileList(zip64);
		if (extra.length) {
			this.fileList.update((list) => [...list, ...extra]);
		}
		return this;
	}

	/**
	 * Decode base64 ZIP into array of file entries
	 */
	private static async decodeBase64ZipToFileList(base64: string) {
		if (!base64) return [];
		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		const zip = await JSZip.loadAsync(bytes.buffer || bytes);
		const entries: Array<any> = [];
		for (const fileName of Object.keys(zip.files)) {
			const entry = zip.files[fileName];
			if (!entry.dir) {
				const content = await entry.async('text');
				entries.push({
					fileName,
					fileContent: content,
					canChangeName: true,
					canDelete: true,
					isReadOnly: false
				});
			}
		}
		return entries;
	}

	/**
	 * Returns payload expected by API: { execution_contexts: [ctx] }
	 */
	public async getForm(): Promise<{ execution_contexts: PrivateExecutionContext[] }> {
		const ctx = await this.getContextPayload();
		return { execution_contexts: [ctx] };
	}

	/**
	 * Build a single PrivateExecutionContext from files and form
	 */
	public async getContextPayload(): Promise<PrivateExecutionContext> {
		const files = get(this.fileList);
		const extras = files.slice(2);

		// zip extras
		const zip = new JSZip();
		extras.forEach((f) => zip.file(f.fileName, f.fileContent));
		const base64 = await zip.generateAsync({ type: 'base64' });

		return {
			language_id: this.languageInfo.id,
			main_code: files[this.mainFileIndex].fileContent,
			driver_code: files[this.solutionFileIndex].fileContent,
			additional_files: base64,
			compiler_options: this.executionContext.compiler_options,
			command_line_arguments: this.executionContext.command_line_arguments,
			cpu_time_limit: this.executionContext.cpu_time_limit,
			wall_time_limit: this.executionContext.wall_time_limit,
			memory_limit: this.executionContext.memory_limit,
			stack_limit: this.executionContext.stack_limit,
			max_file_size: this.executionContext.max_file_size,
			enable_network: this.executionContext.enable_network,
			stdin: this.executionContext.stdin
		};
	}

	/**
	 * Add a new blank file entry
	 */
	public addFile(): void {
		this.fileCounter++;
		const name = `new-file-${this.fileCounter}.txt`;
		this.fileList.update((list) => [
			...list,
			{ fileName: name, fileContent: '', canChangeName: true, canDelete: true, isReadOnly: false }
		]);
	}

	/**
	 * Delete a file at index if allowed
	 */
	public deleteFile(index: number): void {
		const files = get(this.fileList);
		if (!files[index]?.canDelete) return;
		this.fileList.update((list) => list.filter((_, i) => i !== index));
	}

	/**
	 * Rename file at index, verifying oldName and canChangeName
	 */
	public editFileName(
		index: number,
		oldName: string,
		newName: string,
		canChangeName?: boolean
	): void {
		const files = get(this.fileList);
		if (!files[index]?.canChangeName || files[index]?.fileName !== oldName) return;
		this.fileList.update((list) => {
			list[index].fileName = newName;
			return list;
		});
	}

	/**
	 * Update file content at index
	 */
	public updateFileContent(index: number, content: string): void {
		this.fileList.update((list) => {
			if (list[index]) list[index].fileContent = content;
			return list;
		});
	}

	/**
	 * Expose the underlying fileList store
	 */
	public get store(): Writable<Array<{ fileName: string; fileContent: string }>> {
		return this.fileList;
	}

	public get solutionCode() {
		return get(this.fileList)[this.solutionFileIndex].fileContent;
	}

	public set solutionCode(newCode: string) {
		get(this.fileList)[this.solutionFileIndex].fileContent;
	}

	/**
	 * No-op clear
	 */
	public clear(): void {
		// placeholder
	}
}
