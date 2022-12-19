import { StripeItemsProps } from "../App"
import { stripeItem, stripeItemType } from "../types/StripeItem"
import { Repo } from "../types/repo"
import { githubToken } from "../private/GithubKey"
import { Octokit } from "octokit"

// TODO: perhaps move API calls to backend?
 
// authorization for API calls
const octokit = new Octokit({
    //TODO: use oauth
    auth: githubToken
})

/**
 * Generally, this function reads repos from the github API. Has mock testing capability
 * This is the only function that the model has access to
 * 
 * @param StripeItemProps - props to set new stripeItems and read existing stripeItems
 */
async function readGithub({ setItems, items }: StripeItemsProps) {
    // second param can be mockAPIRepsonse() or githubAPIResponse(). Latter for deployment
    const githubRepos = await addGithubRepos(githubAPIResponse(), "wilkyrlx", false);
    const githubOrgs = await addGithubOrgs(getOrgsAPIResponse());

    let newItems = items.slice();
    const allItems = [...newItems, ...githubRepos, ...githubOrgs];
	setItems(allItems);
}

/**
 * Fetches a list of user repos from github API with auth, including fields from
 * the Repo class such as (but not limited to) name, full_name, html_url.
 * 
 * @returns a list of all Repo with certain fields from JSON output
 */
async function githubAPIResponse(): Promise<Repo[]> {
    const generalRepos: Repo[] = await getGeneralReposAPIResponse();
    const teamRepos: Repo[] = await getTeamReposAPIResponse();

    // concat lists together
    return generalRepos.concat(teamRepos);
}

/**
 * Gets all repos for which the user is an owner or collaborator
 * 
 * Note: certain repos may not be visible here, such as (but not limited to)
 * repos where user is a contributor but not a collaborator. Those repos are handled 
 * in other functions.
 * 
 * IMPORTANT: will only collect the first 100 repos found on 1 page
 * 
 * @returns a list of all general Repo with certain fields from JSON output
 */
async function getGeneralReposAPIResponse(): Promise<Repo[]> {
    const repoListFull: Repo[] = [];

    // refer to https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user for documentation    
    const repoData = (await octokit.request('GET /user/repos?affiliation=owner,collaborator&page=1&per_page=100', {})).data;
    repoData.forEach((repo: any) => {
        repoListFull.push(new Repo(repo.name, repo.html_url, repo.owner.login));
    });
    return repoListFull;
}

/**
 * Gets all repos of the teams the user is on
 * 
 * Note: this may be too much data for some users - if some users are on teams with huge
 * numbers of repos. Consider altering in some way/adding the chance to opt out 
 * 
 * IMPORTANT: will only collect the first 100 repos found on 1 page
 * 
 * @returns a list of all team Repo with certain fields from JSON output
 */
async function getTeamReposAPIResponse(): Promise<Repo[]> {
    const repoListFull: Repo[] = [];

    // refer to https://docs.github.com/en/rest/teams/teams#list-teams-for-the-authenticated-user for documentation
    const teamData = (await octokit.request('GET /user/teams?page=1&per_page=100', {})).data;
    for(const team of teamData) {
        // TODO: this only gets 30? repos. May have to add a per_page param to request
        // refer to https://docs.github.com/en/rest/teams/teams#list-team-repositories for documentation
        const teamRepoData = (await octokit.request(team.repositories_url, {})).data;
        teamRepoData.forEach((repo: any) => {
            repoListFull.push(new Repo(repo.name, repo.html_url, repo.owner.login));
        });
    };
    return repoListFull;
}

async function getOrgsAPIResponse(): Promise<Repo[]> {
    const orgsListFull: Repo[] = [];

    const orgData = (await octokit.request('GET /user/memberships/orgs', {})).data;
    for(const org of orgData) {
        const orgSpecificData = (await octokit.request(org.organization.url, {})).data;
        orgsListFull.push(new Repo(orgSpecificData.login, orgSpecificData.html_url, orgSpecificData.login));
    };
    return orgsListFull;
}


    
// TODO: remove me
async function testAPI(){
    const testData = (await octokit.request('GET /user/memberships/orgs', {})).data;
    console.log(testData);

}

/**
 * 
 * @param StripeItemProps - props to set new stripeItems and read existing stripeItems 
 * @param repoListPromise - list of all Repos, unfiltered
 * @param personalName - name of personal github account. I.e. user wilkyrlx would be "wilkyrlx"
 * @param makePersonalDirectory - false normally, true if user wants a separate directory for personal repos
 */
async function addGithubRepos(repoListPromise: Promise<Repo[]>, personalName: string, makePersonalDirectory: boolean): Promise<stripeItem[]> {
    const repoList: Repo[] = await repoListPromise;
    // map of owner name to list of stripeItems. Owner could be user (wilkyrlx), organization, class, etc.
    let ownerMap: Map<string, stripeItem[]> = new Map();

    // for each repository, check the owner and add to hashmap. Repos with same owner get added to a list of stripeItems
    repoList.forEach((repo: Repo) => {
        // name is owner/name, i.e. wilkyrlx/dummy. This prevents naming conflicts, i.e. wilkyrlx/dummy and cmoran5/dummy
        const fullName: string = `${repo.owner}/${repo.name}`;
        if (ownerMap.has(repo.owner)) {
            const tempStripeItem: stripeItem = new stripeItem({ name: fullName, link: repo.html_url, typeItem: stripeItemType.REPO, children: [] })
            // TODO: get rid of this typecasting
            const tempItemList: stripeItem[] = ownerMap.get(repo.owner) as stripeItem[]
            tempItemList.push(tempStripeItem)
            ownerMap.set(repo.owner, tempItemList)
        } else {
            const tempStripeItem: stripeItem = new stripeItem({ name: fullName, link: repo.html_url, typeItem: stripeItemType.REPO, children: [] })
            ownerMap.set(repo.owner, [tempStripeItem])
        }
    });

    const addItems: stripeItem[] = [];

    // for each owner, create a new directory where the childer are the list of stripeItem repos
    // do not create a directory for the personal repos
    ownerMap.forEach((ownerDirectory: stripeItem[], ownerName: string) => {
        if (ownerName === personalName && !makePersonalDirectory) {
            addItems.push.apply(addItems, ownerDirectory)
        } else {
            addItems.push(new stripeItem({ name: ownerName, link: "#", typeItem: stripeItemType.DIRECTORY, children: ownerDirectory }))
        }
    })

    return addItems;
}

async function addGithubOrgs(orgListPromise: Promise<Repo[]>): Promise<stripeItem[]> {
    const orgList: Repo[] = await orgListPromise;
    const addItems: stripeItem[] = [];

    orgList.forEach((org: Repo) => {
        addItems.push(new stripeItem({ name: org.name, link: org.html_url, typeItem: stripeItemType.ORGANIZATION, children: [] }))
    })

    return addItems;    
}

// mocks an API call, use in place of githubAPIResponse
async function mockAPIResponse(): Promise<Repo[]> {
    const repoListFull: Repo[] = [];

    repoListFull.push(new Repo("ccg", "https://github.com/brown-ccg/ccg-website", "brown-ccg"));
    repoListFull.push(new Repo("ccg-tools", "https://github.com/brown-ccg", "brown-ccg"));
    repoListFull.push(new Repo("esgaroth2", "https://github.com/wilkyrlx/esgaroth", "wilkyrlx"));

    return repoListFull;
}

export { readGithub, testAPI }