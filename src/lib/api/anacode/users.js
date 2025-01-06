

async function getUserProblems() {
  const response = await fetch('http://127.0.0.1:6603/users/problems', {
    method: 'GET',
    credentials: 'include', // Ensures cookies are sent with the request
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

async function createUserProblem(problemData) {
  const response = await fetch('http://127.0.0.1:6603/users/problems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(problemData),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}
