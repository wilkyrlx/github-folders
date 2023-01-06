import axios from "axios";
import { Octokit } from "octokit";
import { apiObject, GithubResponse } from "../util/responseShape";



/**
 * Gets all repos for which the user is an owner or collaborator
 * 
 * Note: certain repos may not be visible here, such as (but not limited to)
 * repos where user is a contributor but not a collaborator. Those repos are handled 
 * in other functions.
 * 
 * IMPORTANT: will only collect the first 100 repos found on 1 page
 * 
 * @returns a github response with a list of all general Repo with certain fields from JSON output
 */
export async function generalHandler(octokit: Octokit): Promise<GithubResponse> {

    const responseData: apiObject[] = [];
    // refer to https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user for documentation    
    const repoData = (await octokit.request('GET /user/repos?affiliation=owner,collaborator&page=1&per_page=100', {})).data;
    repoData.forEach((repo: any) => {
        const trimmed: apiObject = {name: repo.name, html_url: repo.html_url, owner: repo.owner.login};
        responseData.push(trimmed);

    });

    return { status: "success", data: responseData };
}

