import axios from "axios";
import { Octokit } from "octokit";
import { githubToken } from "../private/GithubKey";
import { apiObject, GithubResponse } from "../util/responseShape";



// TODO: better docs
// API endpoint for general data
export async function generalHandler(octokit: Octokit): Promise<GithubResponse> {

    const responseData: apiObject[] = [];
    const repoData = (await octokit.request('GET /user/repos?affiliation=owner,collaborator&page=1&per_page=100', {})).data;
    repoData.forEach((repo: any) => {
        const trimmed: apiObject = {name: repo.name, html_url: repo.html_url, owner: repo.owner.login};
        responseData.push(trimmed);

    });

    return { status: "success", data: responseData };
}

