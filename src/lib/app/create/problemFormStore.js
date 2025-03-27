import { z } from 'zod';
import { toast } from 'svelte-sonner';
import { createUserProblem, updateUserProblem } from '$lib/api/anacode/api.anacode.ts';
import { goto } from '$app/navigation';
import { get, writable } from 'svelte/store';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';
import { merge } from 'lodash';

const formDescriptionValidator = z.object({
	title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
	difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
		errorMap: () => ({ message: 'Difficulty must be Easy, Medium, or Hard' })
	}),
	description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
	examples: z
		.array(
			z.object({
				input: z.string().min(1, { message: 'Input cannot be empty' }),
				output: z.string().min(1, { message: 'Output cannot be empty' })
			})
		)
		.min(1, { message: 'At least one example is required' })
});

const executionContextValidator = z.object({
	compiler_options: z.string().max(256, 'Compiler options too long').default(''),
	enable_network: z.boolean(),
	wall_time_limit: z
		.number()
		.min(1, 'Time limit must be at least 1 second')
		.max(5, 'Time limit cannot exceed 5 seconds')
		.default(2)
});

class ProblemFormStore {
	get showSuccessModalWritable() {
		return this._showSuccessModal;
	}

	set showSuccessModal(value) {
		this._showSuccessModal.set(value);
	}

	get problemId() {
		return this._problemId;
	}

	get titleReadable() {
		return this._title;
	}

	get descriptionReadable() {
		return this._description;
	}

	get examplesReadable() {
		return this._examples;
	}

	get difficultyReadable() {
		return this._difficulty;
	}

	get title() {
		return get(this._title);
	}

	set title(value) {
		this._title.set(value);
	}

	get description() {
		return get(this._description);
	}

	set description(value) {
		this._description.set(value);
	}

	get examples() {
		return get(this._examples);
	}

	set examples(value) {
		this._examples.set(value);
	}

	get languageId() {
		return this._languageId;
	}

	get difficulty() {
		return get(this._difficulty);
	}

	set difficulty(value) {
		this._difficulty.set(value);
	}

	get form() {
		return this._form;
	}

	get executionContextForm() {
		return this._executionContextForm;
	}

	constructor(problemId, title, difficulty, description, examples, languageId) {
		this._problemId = problemId;
		this.loadingSubmit = writable(false);
		this.redirectTimeout = null;
		this.redirectToastId = null;
		this._showSuccessModal = writable(false);

		this._difficulty = writable(difficulty);
		this._title = writable(title);
		this._description = writable(description);
		this._examples = writable(examples);
		this._languageId = languageId;

		this._form = superForm(
			{ title, difficulty, description, examples },
			{
				validators: zodClient(formDescriptionValidator),
				dataType: 'json',
				SPA: true
			}
		);

		this._executionContextForm = superForm(
			{ enable_network: true, compiler_options: '', wall_time_limit: 2.1 },
			{
				validators: zodClient(executionContextValidator),
				dataType: 'json',
				SPA: true
			}
		);

		this._form.form.subscribe(({ title, description, difficulty, examples }) => {
			this.title = title;
			this.description = description;
			this.examples = examples;
			this.difficulty = difficulty;
		});

		this.problemIdAfterSubmission = null;
	}

	get executionContextOptions() {
		const { form: formData } = this.executionContextForm;
		return {
			execution_context: get(formData)
		};
	}

	get descriptionForm() {
		return {
			title: this.title,
			difficulty: this.difficulty,
			description: this.description,
			examples: this.examples
		};
	}

	get LoadingWritable() {
		return this.loadingSubmit;
	}

	get Loading() {
		return get(this.LoadingWritable);
	}

	set Loading(isLoading) {
		this.LoadingWritable.set(isLoading);
	}

	async isDescriptionValid() {
		const { validateForm } = this.form;
		const { valid } = await validateForm({ update: true });
		return valid;
	}

	async isExecutionContextFormValid() {
		const { validateForm } = this.executionContextForm;
		const { valid } = await validateForm({ update: true });
		return valid;
	}

	handleRedirect(destination, delayMs = 5000) {
		this.cancelRedirect();
		console.log('showing toast ...');
		this.redirectToastId = toast.loading(`Redirecting to ${destination}`, {
			action: {
				label: 'Cancel',
				onClick: () => this.cancelRedirect()
			},
			duration: 5000
		});
		this.redirectTimeout = setTimeout(() => {
			this.performRedirect(destination);
		}, delayMs);
	}

	cancelRedirect() {
		if (this.redirectTimeout) {
			clearTimeout(this.redirectTimeout);
			this.redirectTimeout = null;
		}
		if (this.redirectToastId) {
			toast.dismiss(this.redirectToastId);
			this.redirectToastId = null;
		}
	}

	async performRedirect(destination) {
		this.cancelRedirect();
		await goto(destination);
	}

	async backToProblem() {
		await this.performRedirect('/my-problems');
	}

	async viewProblem() {
		await this.performRedirect(`/problems/${this.problemIdAfterSubmission}`);
	}

	async handleSubmit(fileManager) {
		if (this.Loading) return;
		this.Loading = true;

		try {
			const userProblemForm = merge(this.descriptionForm, await fileManager.getForm());

			const privateProblemCreated =
				this.problemId === null
					? await createUserProblem(userProblemForm)
					: await updateUserProblem(this.problemId, userProblemForm);

			this.problemIdAfterSubmission = privateProblemCreated.id;
			this.clear();
			fileManager.clear();
			this.showSuccessModal = true;
			this.handleRedirect('/my-problems', 5000);
		} catch (err) {
			console.error(err);
			toast.error(err.message || 'An unexpected error occurred');
		} finally {
			this.Loading = false;
		}
	}

	clear() {
		console.log('clear');
	}
}

export default ProblemFormStore;
