import { z } from 'zod';
import { get, writable } from 'svelte/store';
import { superForm } from 'sveltekit-superforms';
import { zodClient } from 'sveltekit-superforms/adapters';

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

class ProblemDescriptionFormStore {
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

	get difficulty() {
		return get(this._difficulty);
	}

	set difficulty(value) {
		this._difficulty.set(value);
	}

	get form() {
		return this._form;
	}

	constructor(title, difficulty, description, examples) {
		this._difficulty = writable(difficulty);
		this._title = writable(title);
		this._description = writable(description);
		this._examples = writable(examples);

		this._form = superForm(
			{ title, difficulty, description, examples },
			{
				validators: zodClient(formDescriptionValidator),
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
	}

	async isDescriptionValid() {
		const { validateForm } = this.form;
		const { valid } = await validateForm({ update: true });
		return valid;
	}

	async getDescriptionForm() {
		const { form } = this.form;
		const { data } = await form.getForm();
		return data;
	}

	// handleRedirect(destination, delayMs = 5000) {
	// 	this.cancelRedirect();
	// 	console.log('showing toast ...');
	// 	this.redirectToastId = toast.loading(`Redirecting to ${destination}`, {
	// 		action: {
	// 			label: 'Cancel',
	// 			onClick: () => this.cancelRedirect()
	// 		},
	// 		duration: 5000
	// 	});
	// 	this.redirectTimeout = setTimeout(() => {
	// 		this.performRedirect(destination);
	// 	}, delayMs);
	// }
	//
	// cancelRedirect() {
	// 	if (this.redirectTimeout) {
	// 		clearTimeout(this.redirectTimeout);
	// 		this.redirectTimeout = null;
	// 	}
	// 	if (this.redirectToastId) {
	// 		toast.dismiss(this.redirectToastId);
	// 		this.redirectToastId = null;
	// 	}
	// }
	//
	// async performRedirect(destination) {
	// 	this.cancelRedirect();
	// 	await goto(destination);
	// }
	//
	// async backToProblem() {
	// 	await this.performRedirect('/my-problems');
	// }
	//
	// async viewProblem() {
	// 	await this.performRedirect(`/problems/${this.problemIdAfterSubmission}`);
	// }
	//
	// async handleSubmit() {
	// 	try {
	// 		const userProblemForm = this.descriptionForm;
	// 		const privateProblemCreated =
	// 			this.problemId === null
	// 				? await createUserProblem(userProblemForm)
	// 				: await updateUserProblem(this.problemId, userProblemForm);
	//
	// 		this.problemIdAfterSubmission = privateProblemCreated.id;
	// 		this.clear();
	// 		this.showSuccessModal = true;
	// 		this.handleRedirect('/my-problems', 5000);
	// 	} catch (err) {
	// 		console.error(err);
	// 		toast.error(err.message || 'An unexpected error occurred');
	// 	}
	// }
}

export default ProblemDescriptionFormStore;
