import { get, writable } from 'svelte/store';
import JSZip from 'jszip';
import { localStorageJsonWritable } from '$lib/app/utils.js';

// this will manage additional_files, test_code
// This class will manage additional_files, test_code, driver_code
class FileManager {
	constructor(languageInfo, problemData) {
		this.languageInfo = languageInfo;
		this.problemData = problemData;
		const problemID = problemData.id;
		this.mainFileIndex = 0;
		this.solutionFileIndex = 1;
		this.additionalFilesIndexStart = 2;
		this.fileCounter = 0;

		this.fileList = writable([
			{
				fileName: languageInfo.source_file,
				fileContent: problemData.test_code,
				canRename: false,
				canDelete: false,
				isReadOnly: false
			},
			{
				fileName: languageInfo.solution_file,
				fileContent: problemData.driver_code,
				canRename: false,
				canDelete: false,
				isReadOnly: true
			}
		]);
	}

	async init() {
		console.log('Initializing fileManager...');
		const additionalFiles = await FileManager.decodeBase64ZipToFileList(
			this.problemData.additional_files
		);
		this.fileList.update((f) => {
			f.push(...additionalFiles);
			return f;
		});
		return this;
	}

	static async decodeBase64ZipToFileList(base64Zip) {
		if (!base64Zip || base64Zip === '') {
			return [];
		}
		// Decode the base64 string.
		const binaryString = atob(base64Zip);
		const len = binaryString.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		// Load the zip file.
		const zip = await JSZip.loadAsync(bytes);
		const fileList = [];
		// Process each file entry.
		for (const fileName of Object.keys(zip.files)) {
			const fileEntry = zip.files[fileName];
			if (!fileEntry.dir) {
				const content = await fileEntry.async('text');
				fileList.push({
					fileName,
					fileContent: content,
					canDelete: true,
					canChangeName: true,
					isReadOnly: false
				});
			}
		}
		return fileList;
	}

	async getForm() {
		return {
			execution_contexts: [
				{
					additional_files: await this.getAdditionalFileAsBase64Zip(),
					main_code: this.mainCode,
					language_id: this.languageInfo.id,
					driver_code: this.solutionCode
				}
			]
		};
	}

	set solutionCode(solutionCode) {
		const index = this.solutionFileIndex;
		this.setAtIndex(index, solutionCode);
	}

	getAtIndex(index) {
		return get(this.fileList)[index].fileContent;
	}

	setAtIndex(index, content) {
		this.fileList.update((f) => {
			f[index].fileContent = content;
			return f;
		});
	}

	get solutionCode() {
		return this.getAtIndex(this.solutionFileIndex);
	}

	get mainCode() {
		return this.getAtIndex(this.mainFileIndex);
	}

	async getAdditionalFileAsBase64Zip() {
		const files = get(this.fileList);
		const additionalFiles = files.slice(2);
		return await FileManager.createBase64ZipFromFileList(additionalFiles);
	}

	// Static method to create a base64-encoded zip file from an array of file objects.
	static async createBase64ZipFromFileList(fileList) {
		const zip = new JSZip();
		fileList.forEach((file) => {
			zip.file(file.fileName, file.fileContent);
		});
		const base64Zip = await zip.generateAsync({ type: 'base64' });
		return base64Zip;
	}

	get store() {
		return this.fileList;
	}

	editFileName(index, oldFileName, newFileName, canRename) {
		if (!canRename) {
			console.log('cannot edit file');
			return;
		}
		const files = get(this.fileList);
		if (files[index].fileName !== oldFileName) {
			return;
		}
		this.fileList.update((list) => {
			list[index].fileName = newFileName;
			return list;
		});
	}

	deleteFile(index) {
		if (!get(this.fileList)[index].canDelete) {
			console.log('cannot delete file');
			return;
		}
		this.fileList.update((list) => {
			list.splice(index, 1);
			return list;
		});
	}

	addFile() {
		this.fileCounter++;
		const newFileName = `new-file-${this.fileCounter}.txt`;
		this.fileList.update((list) => {
			list.push({
				fileName: newFileName,
				fileContent: '',
				canDelete: true,
				canRename: true,
				isReadOnly: false
			});
			return list;
		});
	}

	clear() {
		console.log('Clearing fileManager...');
	}
}

export default FileManager;
