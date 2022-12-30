import axios from "axios";
import { Octokit } from "octokit"
import { githubToken } from "../private/GithubKey";



// TODO: remove me
async function testAPI(token: string): Promise<any> {

    return axios
        .get("https://api.github.com/user/memberships/orgs", {
            headers: { Authorization: `Bearer ${githubToken}` },
        })
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Error getting user from GitHub`);
            throw error;
        });
    // const data = (await dataRaw).data;
    // const jsonToString: string = JSON.stringify(data);
    // const returnObj = {data}
    // console.log(`this is the returnObj${JSON.stringify(returnObj)}`);
    // return returnObj
}

async function generalAPI(token: string): Promise<any> {
    const octokit = new Octokit({
        auth: githubToken,
    })
    const repoData = (await octokit.request('GET /user/repos?affiliation=owner,collaborator&page=1&per_page=100', {})).data;
    return { repoData }
}

const mockResponse = { data: [
    {
        "url": "https://api.github.com/orgs/TEDxBrownU/memberships/wilkyrlx",
        "state": "active",
        "role": "member",
        "organization_url": "https://api.github.com/orgs/TEDxBrownU",
        "user": {
            "login": "wilkyrlx",
            "id": 93553222,
            "node_id": "U_kgDOBZOCRg",
            "avatar_url": "https://avatars.githubusercontent.com/u/93553222?v=4",
            "gravatar_id": "",
            "url": "https://api.github.com/users/wilkyrlx",
            "html_url": "https://github.com/wilkyrlx",
            "followers_url": "https://api.github.com/users/wilkyrlx/followers",
            "following_url": "https://api.github.com/users/wilkyrlx/following{/other_user}",
            "gists_url": "https://api.github.com/users/wilkyrlx/gists{/gist_id}",
            "starred_url": "https://api.github.com/users/wilkyrlx/starred{/owner}{/repo}",
            "subscriptions_url": "https://api.github.com/users/wilkyrlx/subscriptions",
            "organizations_url": "https://api.github.com/users/wilkyrlx/orgs",
            "repos_url": "https://api.github.com/users/wilkyrlx/repos",
            "events_url": "https://api.github.com/users/wilkyrlx/events{/privacy}",
            "received_events_url": "https://api.github.com/users/wilkyrlx/received_events",
            "type": "User",
            "site_admin": false
        }
    }
]}

export { testAPI, generalAPI, mockResponse };