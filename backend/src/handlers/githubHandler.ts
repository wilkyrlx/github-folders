import { Octokit } from "octokit"
import { githubToken } from "../private/GithubKey";



// TODO: remove me
async function testAPI(token: string) {
    // authorization for API calls
    const octokit = new Octokit({
        auth: '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'
    })
    const testData = (await octokit.request('GET /user/memberships/orgs', {})).data;
    console.log(`this is the MONKEY${testData}`);
}

export default testAPI;