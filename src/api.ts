import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.REACT_APP_OCTOKIT_TOKEN
});

export function fetchRepos() {
    return octokit.request(`GET /users/${process.env.REACT_APP_USERNAME}/repos`);
}

export function fetchRepo(repo: string) {
    return octokit.request(`GET /repos/${process.env.REACT_APP_USERNAME}/${repo}`);
}

export function fetchCommit(repo: string) {
    return octokit.request(`GET /repos/${process.env.REACT_APP_USERNAME}/${repo}/commits`);
}