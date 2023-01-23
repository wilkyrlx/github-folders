import { Octokit } from "octokit";
import { apiObject, GithubResponse } from "../util/responseShape";



/**
 * Gets all organizations for which the user is a member
 * 
 * IMPORTANT: will only collect the first 100 repos found on 1 page
 * 
 * @returns a github response with a list of all orgs from JSON output
 */
export async function orgsHandler(octokit: Octokit): Promise<GithubResponse> {

    const responseData: apiObject[] = [];
    const orgData = (await octokit.request('GET /user/memberships/orgs', {})).data;
    for(const org of orgData) {
        const orgSpecificData = (await octokit.request(org.organization.url, {})).data;
        const trimmed: apiObject = {name: orgSpecificData.login, html_url: orgSpecificData.html_url, owner: orgSpecificData.login};
        responseData.push(trimmed);
    };

    return { status: "success", data: responseData };
}

