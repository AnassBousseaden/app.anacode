import type {
	ProblemPreview,
	PrivateProblem,
	UserProblem,
	Submission,
	UserInfo,
	LanguagePreview,
	Language,
	ProblemTemplate,
	Error,
	PublicProblem,
	UserSubmission,
	JudgeSubmission,
	PrivateExecutionContext
} from '$lib/api/anacode/models';

export const url = 'http://127.0.0.1:6603';

async function handleError(response: Response): Promise<never> {
	try {
		const errorData = (await response.json()) as Error;
		throw new Error(errorData.error || 'Unknown error occurred');
	} catch (e) {
		throw new Error(e.message);
	}
}

// Get All Problems Created by the Authenticated User
export async function getUserProblems(): Promise<ProblemPreview[]> {
	const response = await fetch(`${url}/users/problems`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as ProblemPreview[];
}

// Get Details of a Specific Problem
export async function getUserProblemById(problemId: string): Promise<PrivateProblem> {
	const response = await fetch(`${url}/users/problems/${problemId}`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as PrivateProblem;
}

// Create a New Problem for the Authenticated User
export async function createUserProblem(problemData: UserProblem): Promise<PrivateProblem> {
	const response = await fetch(`${url}/users/problems`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(problemData)
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as PrivateProblem;
}

// Update a Problem
export async function updateUserProblem(
	problemId: string,
	updatedData: UserProblem
): Promise<PrivateProblem> {
	const response = await fetch(`${url}/users/problems/${problemId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(updatedData)
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as PrivateProblem;
}

// Delete a Problem
export async function deleteUserProblem(problemId: string): Promise<void> {
	const response = await fetch(`${url}/users/problems/${problemId}`, {
		method: 'DELETE',
		credentials: 'include'
	});

	if (!response.ok && response.status !== 204) {
		await handleError(response);
	}
}

// Get Submissions for a Specific Problem
export async function getSubmissionsForProblem(problemId: string): Promise<Submission[]> {
	const response = await fetch(`${url}/users/problems/${problemId}/submissions`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as Submission[];
}

export async function getSubmissionsForProblemAndSubmissionId(
	problemId: string,
	submissionId: string
): Promise<Submission> {
	const response = await fetch(`${url}/users/problems/${problemId}/submissions/${submissionId}`, {
		method: 'GET',
		credentials: 'include'
	});
	if (!response.ok) {
		await handleError(response);
	}
	return (await response.json()) as Submission;
}

// Get User Information
export async function getUserInfo(): Promise<UserInfo> {
	const response = await fetch(`${url}/users/user_info`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as UserInfo;
}

// Get All Programming Languages
export async function getProgrammingLanguages(): Promise<LanguagePreview[]> {
	const response = await fetch(`${url}/languages`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as LanguagePreview[];
}

// Get Programming Language by ID
export async function getProgrammingLanguageById(languageId: string): Promise<Language> {
	const response = await fetch(`${url}/languages/${languageId}`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as Language;
}

// Get Problem Template by Language ID
export async function getExecutionContextByLanguageId(
	languageId: string
): Promise<PrivateExecutionContext> {
	const response = await fetch(`${url}/execution-context/${languageId}`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as ProblemTemplate;
}

/**
 * Get all public problems
 * @returns Array of problem previews
 */
export async function getPublicProblems(): Promise<ProblemPreview[]> {
	const response = await fetch(`${url}/problems`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as ProblemPreview[];
}

/**
 * Get details of a specific public problem
 * @param problemId - The ID of the problem to retrieve
 * @returns Detailed problem information
 */
export async function getPublicProblemById(problemId: string): Promise<PublicProblem> {
	const response = await fetch(`${url}/problems/${problemId}`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as PublicProblem;
}

/**
 * Get all submissions for a user's problem
 * This endpoint is under the User tag and requires authentication
 *
 * @param problemId - The ID of the problem to get submissions for
 * @returns Array of submissions for the problem
 */
export async function getUserProblemSubmissions(problemId: string): Promise<Submission[]> {
	console.log('getting submissions for user');
	const response = await fetch(`${url}/users/problems/${problemId}/submissions`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as Submission[];
}

/**
 * Submit a solution to a problem
 * This endpoint is under the Submit tag and requires authentication
 *
 * @param problemId - The ID of the problem to submit a solution for
 * @param submission - The submission data including code and language
 * @returns The judge's response to the submission
 */
export async function submitSolution(
	problemId: string,
	submission: UserSubmission
): Promise<JudgeSubmission> {
	const response = await fetch(`${url}/submit/${problemId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(submission)
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as JudgeSubmission;
}

/**
 * Get details of a specific submission
 * This endpoint is under the Submit tag and requires authentication
 *
 * @param submissionId - The ID of the submission to retrieve
 * @returns The submission details including judge results
 */
export async function getSubmissionById(submissionId: string): Promise<JudgeSubmission> {
	const response = await fetch(`${url}/submit/${submissionId}`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return (await response.json()) as JudgeSubmission;
}
