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

export let step1Description = `In this step, you'll write your problem description.

- Start with a clear problem statement
- Explain input/output formats and data types
- List any constraints (e.g., time/space complexity, input ranges)
- Provide 2-3 examples with explanations
- Add any helpful hints or notes (optional)

A good description helps users understand exactly what they need to solve!`;

export let step2description = `Here you'll create the starting code template for users.

- Set up the main function/class structure
- Define parameter types and return type
- Add any necessary imports or helper code
- Include comments to guide users

This code will be the starting point for everyone attempting your problem.`;
export let step3Description = `Now it's time to create test cases to validate solutions.

- Start with simple, basic test cases
- Add edge cases (empty inputs, boundary values, etc.)
- Include large test cases for performance testing
- Provide explanations for complex test cases

Good test cases help ensure users' solutions work correctly!`;
export let step4Description = `Final step! Review everything before publishing.

- Check your problem description for clarity
- Verify the driver code compiles correctly
- Run all test cases to confirm they work
- Make any final adjustments

Once you're satisfied, hit save to publish your problem!`;
