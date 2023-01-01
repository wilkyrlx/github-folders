import axios from "axios";
import { Octokit } from "octokit";
import { githubToken } from "../private/GithubKey";
import { apiObject, GithubResponse } from "../util/responseShape";



/**
 * Gets all repos of the teams the user is on
 * 
 * Note: this may be too much data for some users - if some users are on teams with huge
 * numbers of repos. Consider altering in some way/adding the chance to opt out 
 * 
 * IMPORTANT: will only collect the first 100 repos found on 1 page
 * 
 * @returns a github response with a list of all general Repo with certain fields from JSON output
 */
export async function teamsHandler(octokit: Octokit): Promise<GithubResponse> {

    const responseData: apiObject[] = [];

    // refer to https://docs.github.com/en/rest/teams/teams#list-teams-for-the-authenticated-user for documentation
    const teamData = (await octokit.request('GET /user/teams?page=1&per_page=100', {})).data;
    for(const team of teamData) {
        // TODO: this only gets 30? repos. May have to add a per_page param to request
        // refer to https://docs.github.com/en/rest/teams/teams#list-team-repositories for documentation
        const teamRepoData = (await octokit.request(team.repositories_url, {})).data;
        teamRepoData.forEach((repo: any) => {
            const trimmed: apiObject = {name: repo.name, html_url: repo.html_url, owner: repo.owner.login};
            responseData.push(trimmed);
        });
    };

    return { status: "success", data: responseData };
}

