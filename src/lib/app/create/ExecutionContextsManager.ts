import { writable, get, type Writable } from 'svelte/store';
import { toast } from 'svelte-sonner';
import type { Language, PrivateExecutionContext } from '$lib/api/anacode/models';
import { getExecutionContextByLanguageId } from '$lib/api/anacode/api.anacode';

export class PrivateExecutionsContextManager {
	// Main store for all execution contexts
	private executionContexts: Writable<Map<number, Writable<PrivateExecutionContext>>>;

	// Current selected execution context
	private currentPrivateExecutionContext: Writable<PrivateExecutionContext | null>;

	// Current selected language ID
	private currentLanguageId: Writable<number | null>;

	// Programming languages available
	private programmingLanguages: Language[];

	private allLanguageIds: Writable<number[]>;

	// Show programming languages dialog
	public showProgrammingLanguages: Writable<boolean>;

	constructor(
		initialPrivateExecutionContexts: PrivateExecutionContext[] = [],
		programmingLanguages: Language[]
	) {
		// Initialize stores
		this.executionContexts = writable(
			new Map(initialPrivateExecutionContexts.map((ctx) => [ctx.language_id, writable(ctx)]))
		);
		this.currentPrivateExecutionContext = writable(null);
		this.currentLanguageId = writable(null);
		this.showProgrammingLanguages = writable(false);
		this.programmingLanguages = programmingLanguages;
		this.allLanguageIds = writable([]);

		// wire all language ids
		this.executionContexts.subscribe((map) => {
			this.allLanguageIds.set(Array.from(map.keys()));
		});

		// Set initial language if we have contexts
		if (initialPrivateExecutionContexts.length > 0) {
			this.setCurrentLanguageId(initialPrivateExecutionContexts[0].language_id);
		}

		// Subscribe to execution context changes to update current language
		this.executionContexts.subscribe((map) => {
			if (map.size > 0 && !get(this.currentLanguageId)) {
				this.setCurrentLanguageId(Array.from(map.keys())[0]);
			}

			// Reset current execution context if it was deleted
			if (
				get(this.currentPrivateExecutionContext)?.language_id &&
				!map.has(get(this.currentPrivateExecutionContext)?.language_id)
			) {
				this.currentPrivateExecutionContext.set(null);
			}
		});
	}

	/**
	 * Gets the execution contexts store
	 */
	getPrivateExecutionContextsStore(): Writable<Map<number, Writable<PrivateExecutionContext>>> {
		return this.executionContexts;
	}

	/**
	 * Gets the current execution context store
	 */
	getCurrentPrivateExecutionContextStore(): Writable<PrivateExecutionContext | null> {
		return this.currentPrivateExecutionContext;
	}

	/**
	 * Gets the current language ID store
	 */
	getCurrentLanguageIdStore(): Writable<number | null> {
		return this.currentLanguageId;
	}

	public getLanguageIds(): Writable<number[] | null> {
		return this.allLanguageIds;
	}

	/**
	 * Gets array of all execution contexts
	 */
	getAllPrivateExecutionContexts(): PrivateExecutionContext[] {
		return Array.from(get(this.executionContexts).values()).map((ctx) => get(ctx));
	}

	/**
	 * Sets the current language ID
	 */
	setCurrentLanguageId(languageId: number): void {
		this.currentLanguageId.set(languageId);
	}

	/**
	 * Adds a new execution context
	 */
	async addPrivateExecutionContext(languageId: number): Promise<void> {
		try {
			const ctx = await getExecutionContextByLanguageId(`${languageId}`);
			console.log('newcontext', ctx);
			console.log('langid', languageId);
			console.log('langid', this.executionContexts);

			this.executionContexts.update((map) => {
				console.log('map', map);
				map.set(languageId, writable(ctx));
				return map;
			});
			this.showProgrammingLanguages.set(false);
			// Optionally select the newly added context
			this.selectPrivateExecutionContext(languageId);
		} catch (err) {
			toast.error(`Failed to load template: ${err.message}`);
		}
	}

	/**
	 * Selects an execution context by language ID
	 */
	selectPrivateExecutionContext(languageId: number): void {
		const contextMap = get(this.executionContexts);
		if (contextMap.has(languageId)) {
			const ctx = get(contextMap.get(languageId));
			this.currentPrivateExecutionContext.set(ctx);
			this.currentLanguageId.set(languageId);
		}
	}

	/**
	 * Updates an execution context
	 */
	updatePrivateExecutionContext(updatedContext: PrivateExecutionContext): void {
		this.executionContexts.update((map) => {
			map.set(updatedContext.language_id, writable(updatedContext));
			return map;
		});
		// Optionally clear the current selection
		this.currentPrivateExecutionContext.set(null);
	}

	/**
	 * Deletes an execution context
	 */
	deletePrivateExecutionContext(languageId: number): void {
		this.executionContexts.update((map) => {
			map.delete(languageId);
			return map;
		});

		// If we deleted the current selected language, select another one
		if (get(this.currentLanguageId) === languageId) {
			const contextMap = get(this.executionContexts);
			if (contextMap.size > 0) {
				this.setCurrentLanguageId(Array.from(contextMap.keys())[0]);
			} else {
				this.currentLanguageId.set(null);
			}
		}
	}

	/**
	 * Validates if there's at least one execution context
	 */
	validatePrivateExecutionContexts(): boolean {
		return get(this.executionContexts).size > 0;
	}

	/**
	 * Toggle the programming languages dialog
	 */
	toggleProgrammingLanguagesDialog(show: boolean): void {
		this.showProgrammingLanguages.set(show);
	}

	/**
	 * Gets programming language name from ID
	 */
	private getProgrammingLanguageNameFromID(id: number): string {
		const language: Language = this.programmingLanguages.find((lang) => lang.id === id);
		return language ? language.name : `Language ${id}`;
	}
}
