// @ts-nocheck

export const url = "http://127.0.0.1:6603";

export const pollingConfig = {
    maxAttempts: 4,
    interval: 1000
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
            typed_code: typed_code,
        })
    }
    );
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
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
        },
    }
    );
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
    }
    const data = await response.json()
    return data;
}

export async function pollForResult(token) {
    let attempts = 0;
    while (attempts < pollingConfig.maxAttempts) {
        const result = await getFromJudge(token);
        if (result.status_id > 2) {
            return result;
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, pollingConfig.interval));
    }
    throw new Error('Max polling attempts reached'); // Error if max attempts are hit
}
