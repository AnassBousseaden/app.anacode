// @ts-nocheck
import { url } from '$lib/api/anacode/api.anacode.js';

export { url };

export const pollingConfig = {
	maxAttempts: 4,
	interval: 1000
};

export const SubmissionStatus = Object.freeze({
	Idle: 'idle',
	Running: 'running',
	Error: 'error',
	Success: 'execution success',
	Timeout: 'timeout'
});

export class TimeOut extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeOut';
	}
}

export class JudgeError extends Error {
	constructor(message) {
		super(message);
		this.name = 'JudgeError';
	}
}

export async function postToJudge(problem_id, typed_code) {
	const url_submission = `${url}/submit/${problem_id}`;
	const response = await fetch(url_submission, {
		credentials: 'include',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			typed_code: typed_code
		})
	});
	if (!response.ok) {
		throw new JudgeError(`${response.error || 'Unknown error'}`);
	}
	const data = await response.json();
	return data.token;
}

export async function getFromJudge(token) {
	const url_submission = `${url}/submit/${token}`;
	const response = await fetch(url_submission, {
		credentials: 'include',
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!response.ok) {
		throw new JudgeError(`${response.error || 'Unknown error'}`);
	}
	return await response.json();
}

export async function pollForResult(token) {
	let attempts = 0;
	while (attempts < pollingConfig.maxAttempts) {
		const result = await getFromJudge(token);
		if (result.status_id > 2) {
			return result;
		}
		attempts++;
		await new Promise((resolve) => setTimeout(resolve, pollingConfig.interval));
	}
	throw new TimeOut();
}

export async function getSubmissions(problem_id) {
	const url_get_submissions = `${url}/users/problems/${problem_id}/submissions`;
	const response = await fetch(url_get_submissions, {
		credentials: 'include',
		method: 'GET'
	});
	if (!response.ok) {
		throw new JudgeError(`${response.error || 'Unknown error'}`);
	}
	return await response.json();
}

export async function getSubmission(problem_id, submission_id) {
	const url_get_submissions = `${url}/users/problems/${problem_id}/submissions/${submission_id}`;
	const response = await fetch(url_get_submissions, {
		credentials: 'include',
		method: 'GET'
	});
	if (!response.ok) {
		throw new JudgeError(`${response.error || 'Unknown error'}`);
	}
	return await response.json();
}
