const BASE_URL = `https://repo-tracker-api.vercel.app/api`;

export function fetchRepos() {
    return fetch(`${BASE_URL}/repos`).then((response) =>
        response.json()
    );
}

export function fetchRepo(repo: string) {
    return fetch(`${BASE_URL}/repo/${repo}`).then((response) =>
        response.json()
    );
}

export function fetchCommit(repo: string) {
    return fetch(`${BASE_URL}/commits/${repo}`).then((response) =>
        response.json()
    );
}