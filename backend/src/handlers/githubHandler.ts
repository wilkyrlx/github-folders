import { Octokit } from "octokit"
import { githubToken } from "../private/GithubKey";



// TODO: remove me
async function testAPI(token: string) {
    // authorization for API calls
    const octokit = new Octokit({
        auth: githubToken,
    })
    const testData = (await octokit.request('GET /user/memberships/orgs', {})).data;
    const jsonToString = JSON.stringify(testData);
    console.log(`this is the MONKEY${jsonToString}`);
    return {testObj: "1", testObj2: "2 - object"}
}

async function generalAPI(token: string) {
    const octokit = new Octokit({
        auth: githubToken,
    })
    const repoData = (await octokit.request('GET /user/repos?affiliation=owner,collaborator&page=1&per_page=100', {})).data;
    return repoData
}

export { testAPI, generalAPI };