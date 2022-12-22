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
}

export default testAPI;