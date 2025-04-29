export let stepDescriptionText = {
	title: `Write your problem description.`,
	description: `
<p><em>Details</em>:</p>
<ul class="list-disc pl-5">
  <li>Start with a clear problem statement</li>
  <li>Explain input/output formats and data types</li>
  <li>List any constraints (e.g., time/space complexity, input ranges)</li>
  <li>Provide 2-3 examples</li>
  <li>The editor supports basic markdown</li>
</ul>
<p>
  A clear and detailed description ensures users fully understand the problem and expectations.
</p>
`
};

export let stepExecutionContextText = {
	title: `Configure the complete test environment for the problem.`,
	description: `
<p><em>Overview</em>:</p>
<p>In this step, you'll set up the entire execution environment that validates user solutions. This includes creating driver code, writing test cases, and configuring runtime settings.</p>

<p><em>Details</em>:</p>
<ul class="list-disc pl-5">
  <li>Create execution contexts for multiple programming languages</li>
  <li>Configure runtime parameters (timeouts, memory limits, network permissions)</li>
  <li>Set compiler/interpreter options and command-line arguments</li>
  <li>Define the folder structure and any necessary files</li>
  <li><strong>Exit codes</strong>: A program exiting with code 0 is considered successful; any other exit code indicates failure</li>
  <li><strong>Output display</strong>: stderr will be shown to users as feedback, so use it intentionally</li>
</ul>
<p>
  This is a <strong>private</strong> execution context that will never be shared with users attempting to solve the problem.
</p>
`
};

export let stepDriverCodeText = {
	title: `Create the starting code template for users.`,
	description: `
<p><em>Details</em>:</p>
<ul class="list-disc pl-5">
  <li>Set up the function/class structure that users will implement</li>
  <li>Define parameter types, return types, and function signatures</li>
  <li>Include necessary imports and basic utilities</li>
  <li>Add helpful comments to guide users on what they need to implement</li>
  <li>This code serves as the "black box" interface between the user's solution and your test environment</li>
  <li>Ensure consistency between this template and your execution context</li>
</ul>
<p>
  Well-designed starter code helps users focus on solving the core problem rather than setting up boilerplate.
</p>
`
};

export let stepTestCasesText = {
	title: `Design comprehensive test cases to validate solutions.`,
	description: `
<p><em>Details</em>:</p>
<ul class="list-disc pl-5">
  <li>Create a variety of test cases from basic examples to edge cases</li>
  <li><strong>Security note</strong>: Since stdout will be displayed to users, load test cases into memory from stdin before executing user code to keep test data secret</li>
  <li>Implement a "fail fast" testing strategy to avoid revealing all test cases upon submission</li>
  <li>Use stderr for meaningful feedback messages that help users understand why their solution failed</li>
  <li>Consider adding hidden test cases that check for performance or specific edge cases</li>
  <li>Ensure test cases work consistently across all supported languages</li>
  <li>In the editor, add files/directory using the context menu (right-click in the file explorer)</li>
</ul>
<p>
  Well-designed test cases ensure solutions are correct, efficient, and handle all required scenarios.
</p>
`
};

export let stepPreviewAndSaveText = {
	title: `Review everything before publishing.`,
	description: `
<p><em>Details</em>:</p>
<ul class="list-disc pl-5">
  <li>Check your problem description for clarity</li>
  <li>Verify the driver code</li>
  <li>Run all test cases to confirm they work</li>
  <li>Make any final adjustments</li>
  <li>You can always come back and modify the problem!</li>
</ul>
<p>
  Once you're satisfied, publish your problem!
</p>
`
};
