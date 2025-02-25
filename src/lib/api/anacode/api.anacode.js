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

// mock implementation

async function getProblemStats(problemId) {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 800));

	// Generate random but somewhat realistic data based on problemId
	// Using the problemId as a seed ensures consistent stats for the same problem
	const seed = problemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const rand = (min, max) => Math.floor((Math.random() * (max - min + 1) + min) * (1 + (seed % 10) / 30));

	// Basic stats
	const totalSubmissions = rand(20, 200);
	const passedSubmissions = rand(5, totalSubmissions * 0.7);
	const failedSubmissions = rand(5, totalSubmissions * 0.4);
	const partialSubmissions = rand(0, totalSubmissions * 0.2);
	const errorSubmissions = totalSubmissions - passedSubmissions - failedSubmissions - partialSubmissions;
	const successRate = Math.round((passedSubmissions / totalSubmissions) * 100);
	const uniqueUsers = rand(5, Math.min(totalSubmissions, 50));

	// Time metrics (minutes:seconds format)
	const avgMinutes = rand(1, 20);
	const avgSeconds = rand(0, 59);
	const avgCompletionTime = `${avgMinutes.toString().padStart(2, '0')}:${avgSeconds.toString().padStart(2, '0')}`;

	// Runtime metrics
	const minRuntime = rand(10, 100);
	const maxRuntime = rand(minRuntime + 50, minRuntime + 500);
	const avgRuntime = Math.round((minRuntime + maxRuntime) / 2);

	// Memory metrics
	const minMemory = rand(5, 30);
	const maxMemory = rand(minMemory + 10, minMemory + 100);
	const avgMemory = Math.round((minMemory + maxMemory) / 2);

	// Generate recent submissions
	const recentSubmissions = Array.from({ length: 5 }, (_, i) => {
		const daysAgo = i;
		const date = new Date();
		date.setDate(date.getDate() - daysAgo);

		return {
			userId: `user_${rand(100, 999)}`,
			submittedAt: date.toISOString(),
			passed: Math.random() > 0.4,
			runtime: rand(minRuntime, maxRuntime),
			memory: rand(minMemory, maxMemory)
		};
	});

	// Generate common errors
	const errorTypes = [
		{ type: 'TypeError', message: 'Cannot read property of undefined' },
		{ type: 'ReferenceError', message: 'Variable is not defined' },
		{ type: 'RangeError', message: 'Maximum call stack size exceeded' },
		{ type: 'SyntaxError', message: 'Unexpected token' },
		{ type: 'TimeoutError', message: 'Execution timed out' }
	];

	const commonErrors = errorTypes
		.slice(0, rand(2, 4))
		.map(error => ({
			...error,
			count: rand(1, 15)
		}))
		.sort((a, b) => b.count - a.count);

	// Generate submissions by day of week
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	const submissionsByDay = days.reduce((acc, day) => {
		acc[day] = rand(1, 20);
		return acc;
	}, {});

	return {
		problemId,
		totalSubmissions,
		passedSubmissions,
		failedSubmissions,
		partialSubmissions,
		errorSubmissions,
		successRate,
		uniqueUsers,
		avgCompletionTime,
		minRuntime,
		maxRuntime,
		avgRuntime,
		minMemory,
		maxMemory,
		avgMemory,
		recentSubmissions,
		commonErrors,
		submissionsByDay
	};
}




export {
	getProblemStats,
	getUserInfo,
	getUserProblems,
	createUserProblem,
	getUserProblemById,
	updateUserProblem,
	deleteUserProblem,
	getSubmissionsForProblem
};
