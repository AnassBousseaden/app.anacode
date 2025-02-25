export const url = 'http://127.0.0.1:6603';

// api.js

// Helper function to handle errors
async function handleError(response) {
	const errorData = await response.json();
	throw new Error(errorData.error || 'Unknown error occurred');
}

// Get All Problems Created by the Authenticated User
async function getUserProblems() {
	const response = await fetch(`${url}/users/problems`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return await response.json();
}

// Get Details of a Specific Problem
async function getUserProblemById(problemId) {
	const response = await fetch(`${url}/users/problems/${problemId}`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return response.json();
}

// Create a New Problem for the Authenticated User
async function createUserProblem(problemData) {
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

	return response.json();
}

// Update a Problem
async function updateUserProblem(problemId, updatedData) {
	const response = await fetch(`${url}/users/problems/${problemId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
		body: JSON.stringify(updatedData)
	});
	console.log('is the response ok :', response.ok);

	if (!response.ok) {
		await handleError(response);
	}

	return response.json();
}

// Delete a Problem
async function deleteUserProblem(problemId) {
	const response = await fetch(`${url}/users/problems/${problemId}`, {
		method: 'DELETE',
		credentials: 'include'
	});

	if (!response.ok && response.status !== 204) {
		await handleError(response);
	}
}

// Get Submissions for a Specific Problem
async function getSubmissionsForProblem(problemId) {
	const response = await fetch(`${url}/users/problems/${problemId}/submissions`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return response.json();
}

async function getUserInfo() {
	const response = await fetch(`${url}/users/user_info`, {
		method: 'GET',
		credentials: 'include'
	});

	if (!response.ok) {
		await handleError(response);
	}

	return response.json();
}

export {
	getUserInfo,
	getUserProblems,
	createUserProblem,
	getUserProblemById,
	updateUserProblem,
	deleteUserProblem,
	getSubmissionsForProblem
};
