// File containing all the content displayed to the user rather.
// easy way to do things even if this is not so scalable

export let sample_driver_code = `# sample driver code
from typing import List

class Solution:
  def solve(self, nums: List[int]) -> int:
    return 0
`;
export let sample_test_code = `# sample test code
import unittest
from typing import List

class TestSolution(unittest.TestCase):

  def setUp(self):
    self.solution = Solution()
      
  def test(self):
    input = [0,1,0]
    expected_output = 5
    user_output = self.solution.solve(input)
    self.assertEqual(user_output, expected_output)

if __name__ == "__main__":
  unittest.main(failfast=True)

`;

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

export let stepDriverCodeText = {
	title: `Create the starting code template for users.`,
	description: `
<p><em>Details</em>:</p>
<ul class="list-disc pl-5">
  <li>Set up the main function/class structure</li>
  <li>Define parameter types and return type</li>
  <li>Add any necessary imports or helper code</li>
  <li>Include comments to guide users</li>
</ul>
<p>
  This starter code helps users focus on solving the problem without worrying about setup.
</p>
`
};

export let stepTestCasesText = {
	title: `Create test cases to validate solutions.`,
	description: `
<p><em>Details</em> :</p>
<ul class="list-disc pl-5">
  <li>Start with simple, basic test cases, add edge cases (empty inputs, boundary values, etc.)</li>
  <li>Make sure to define the main entry point here</li>
  <li>Prefer using a <strong>unit test library</strong> to validate user's code</li>
  <li>Make sure to have a <strong>"fail fast"</strong> testing strategy to not disclose every test case upon submission</li>
  <li><em>stderr</em> will be displayed to the user upon submission</li>
  <li>A <em><strong>non-zero return code</strong></em> indicates a failed submission</li>
  <li>Submissions taking longer than 2 seconds will timeout</li>
</ul>
<p>Good test cases help ensure users' solutions work correctly!</p>
`
};

export let stepPreviewAndSaveText = {
	title: `Review everything before publishing.`,
	description: `
<p><em>Details</em>:</p>
<ul class="list-disc pl-5">
  <li>Check your problem description for clarity</li>
  <li>Verify the driver code compiles correctly</li>
  <li>Run all test cases to confirm they work</li>
  <li>Make any final adjustments</li>
</ul>
<p>
  Once you're satisfied, hit publish!
</p>
`
};
