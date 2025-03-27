/**
 * TypeScript definitions for backend models
 * Generated from OpenAPI specification
 */

// Enums
export enum Difficulty {
	Easy = 'Easy',
	Medium = 'Medium',
	Hard = 'Hard'
}

// Basic types
export interface Error {
	error: string;
}

export interface Example {
	input: string;
	output: string;
}

export interface PromptContent {
	title: string;
	difficulty: string;
	description: string;
	examples: Example[];
}

// Language related types
export interface LanguagePreview {
	id: LanguageId;
	name: string;
}

export interface Language extends LanguagePreview {
	source_file: string;
	solution_file: string;
	run_cmd: string;
	compile_cmd: string | null;
}

// Execution context types
export interface PublicExecutionContext {
	language_id: LanguageId;
	driver_code: string;
}

export interface PrivateExecutionContext extends PublicExecutionContext {
	main_code: string;
	additional_files: string;
	compiler_options: string | null;
	command_line_arguments: string | null;
	cpu_time_limit: number | null;
	wall_time_limit: number | null;
	memory_limit: number | null;
	stack_limit: number | null;
	max_file_size: number | null;
	enable_network: boolean | null;
	stdin: string | null;
}

// Problem types
export interface ProblemPreview {
	id: string;
	language_ids: LanguageId[];
	updated_at: string;
	created_at: string;
	title: string;
	difficulty: Difficulty;
}

export interface PublicProblem {
	id: string;
	created_at: string;
	updated_at: string;
	title: string;
	difficulty: string;
	description: string;
	examples: Example[];
	execution_contexts: PublicExecutionContext[];
}

export interface PrivateProblem {
	id: string;
	created_at: string;
	updated_at: string;
	title: string;
	difficulty: string;
	description: string;
	examples: Example[];
	execution_contexts: PrivateExecutionContext[];
}

export interface UserProblem {
	title: string;
	difficulty: Difficulty;
	description: string;
	examples: Example[];
	execution_contexts: PrivateExecutionContext[];
}

export interface ProblemTemplate extends PrivateExecutionContext {}

// Submission types
export interface UserSubmission {
	typed_code: string;
	language_id: LanguageId;
}

export interface SubmissionResult {
	status_id: SubmissionStatus | null;
	status_message: string | null;
	description: string | null;
	stdout: string | null;
	stderr: string | null;
	compile_output: string | null;
	time: number | null;
	memory: number | null;
}

export enum SubmissionStatus {
	InQueue = 1,
	Processing,
	ExecutionSuccess,
	WrongAnswer,
	TimeLimitExceeded,
	CompilationError,
	RuntimeErrorSIGSEGV,
	RuntimeErrorSIGXFSZ,
	RuntimeErrorSIGFPE,
	RuntimeErrorSIGABRT,
	RuntimeErrorNZEC,
	RuntimeErrorOther,
	InternalError,
	ExecFormatError
}

export enum LanguageId {
	Java = 62,
	OCaml = 65,
	Python3 = 71,
	Kotlin = 78
}

export interface Submission extends UserSubmission, SubmissionResult {
	token: string;
	created_at: string;
}

export interface JudgeSubmission extends SubmissionResult {
	language_id: LanguageId;
	token: string;
}

// User types
export interface UserInfo {
	user_id: number;
	user_name: string;
	provider: string;
}
