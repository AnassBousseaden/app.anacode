import type { JudgeSubmission, Submission, UserSubmission } from '$lib/api/anacode/models.ts';
import {
	submitSolution,
	getSubmissionById,
	getSubmissionsForProblem
} from '$lib/api/anacode/api.anacode';
import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export enum ClientStatus {
	Processing = 'Processing',
	Idle = 'Idle',
	Timeout = 'Timeout',
	Error = 'Error',
	Success = 'Success'
}

export interface SubmissionClientOptions {
	/** Maximum time to poll for results in milliseconds */
	maxPollTime?: number;
	/** Interval between polling attempts in milliseconds */
	pollInterval?: number;
	problemId: string;
}

export interface ClientState {
	ClientStatus: ClientStatus;
	ClientMessage: string | null;
	SubmissionResult: Submission | null;
}

export class SubmissionClient {
	private readonly maxPollTime: number;
	private readonly pollInterval: number;
	public submissions: Writable<Submission[]> = writable([]);
	public clientState: Writable<ClientState> = writable<ClientState>({
		ClientStatus: ClientStatus.Idle,
		ClientMessage: null,
		SubmissionResult: null
	});
	private readonly problemId: string;

	constructor(options: SubmissionClientOptions) {
		this.maxPollTime = options.maxPollTime ?? 8000; // Default 8 seconds
		this.pollInterval = options.pollInterval ?? 1000;
		this.problemId = options.problemId;
	}

	get ClientState(): Writable<ClientState> {
		return this.clientState;
	}

	get Submissions(): Writable<Submission[]> {
		return this.submissions;
	}

	/**
	 * Submit a solution and poll for results
	 * @param problemId - The ID of the problem
	 * @param userSubmission - The userSubmission data
	 * @returns A promise that resolves to the final userSubmission result
	 */
	public async submit(userSubmission: UserSubmission) {
		console.log('submit:', userSubmission);
		const currentClientState = get(this.clientState).ClientStatus;
		if (currentClientState === ClientStatus.Processing) {
			return this.clientState;
		}
		this.clientState.set({
			ClientStatus: ClientStatus.Processing,
			ClientMessage: null,
			SubmissionResult: null
		});

		try {
			const judgeSubmission = await submitSolution(this.problemId, userSubmission);
			await this.pollForResult(judgeSubmission, userSubmission);
		} catch (err) {
			console.error(err);
			this.clientState.set({
				ClientStatus: ClientStatus.Error,
				ClientMessage: err.message,
				SubmissionResult: null
			});
		}
	}

	/**
	 * Poll for the result of a submission
	 * @returns A promise that resolves to the final submission result
	 * @param judgeSubmission the initial result from post
	 * @param userSubmission the user submitted code
	 */
	private async pollForResult(judgeSubmission: JudgeSubmission, userSubmission: UserSubmission) {
		const { token: submissionId } = judgeSubmission;
		const startTime = Date.now();
		let latestResult: JudgeSubmission;
		while (true) {
			if (Date.now() - startTime > this.maxPollTime) {
				this.clientState.set({
					ClientStatus: ClientStatus.Timeout,
					ClientMessage: 'client time out 😒',
					SubmissionResult: null
				});
				return;
			}
			await new Promise((resolve) => setTimeout(resolve, this.pollInterval));
			latestResult = await getSubmissionById(submissionId);
			if (latestResult.status_id > 2) {
				const submission: Submission = {
					token: submissionId,
					created_at: new Date().toISOString(),
					...latestResult,
					...userSubmission
				};
				this.clientState.set({
					ClientStatus: ClientStatus.Success,
					ClientMessage: null,
					SubmissionResult: submission
				});
				// todo: that's cheating but good enough
				this.submissionSuccess(submission);
				return;
			}
		}
	}

	private submissionSuccess(submission: Submission) {
		this.submissions.update((submissions) => {
			submissions.push(submission);
			return submissions;
		});
	}
}
