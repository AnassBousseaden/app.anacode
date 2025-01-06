import { z } from 'zod';

export let formDescriptionValidator = z.object({
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
