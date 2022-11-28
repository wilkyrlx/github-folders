import { StripeItemsProps } from "../App"
import { stripeItem, stripeItemType } from "../data/StripeItem"
import { Repo } from "../data/repo"
import { githubToken } from "../private/GithubKey"
import { Octokit } from "octokit"

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
    addGithubRepos({ setItems, items }, githubAPIResponse(), "wilkyrlx", false);
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
 * @returns a list of all general Repo with certain fields from JSON output
 */
async function getGeneralReposAPIResponse(): Promise<Repo[]> {
    const repoListFull: Repo[] = [];

    // TODO: add better error catching here
    // refer to https://docs.github.com/en/rest/repos/repos#list-repositories-for-the-authenticated-user for documentation    
    const repoData = (await octokit.request('GET /user/repos?affiliation=owner,collaborator&page=1&per_page=100', {})).data;
    repoData.forEach((repo: any) => {
        repoListFull.push(new Repo(repo.name, repo.full_name, repo.html_url, repo.owner.login));
    });
    return repoListFull;
}

/**
 * Gets all repos of the teams the user is on
 * 
 * Note: this may be too much data for some users - if some users are on teams with huge
 * numbers of repos. Consider altering in some way/adding the chance to opt out 
 * 
 * @returns a list of all team Repo with certain fields from JSON output
 */
async function getTeamReposAPIResponse(): Promise<Repo[]> {
    const repoListFull: Repo[] = [];

    // refer to https://docs.github.com/en/rest/teams/teams#list-teams-for-the-authenticated-user for documentation
    const teamData = (await octokit.request('GET /user/teams', {})).data;
    for(const team of teamData) {
        // refer to https://docs.github.com/en/rest/teams/teams#list-team-repositories for documentation
        const teamRepoData = (await octokit.request(team.repositories_url, {})).data;
        teamRepoData.forEach((repo: any) => {
            repoListFull.push(new Repo(repo.name, repo.full_name, repo.html_url, repo.owner.login));
        });
    };
    return repoListFull;
}

/**
 * 
 * @param StripeItemProps - props to set new stripeItems and read existing stripeItems 
 * @param repoListPromise - list of all Repos, unfiltered
 * @param personalName - name of personal github account. I.e. user wilkyrlx would be "wilkyrlx"
 * @param makePersonalDirectory - false normally, true if user wants a separate directory for personal repos
 */
async function addGithubRepos({ setItems, items }: StripeItemsProps, repoListPromise: Promise<Repo[]>, personalName: string, makePersonalDirectory: boolean) {
    const repoList: Repo[] = await repoListPromise;
    // map of owner name to list of stripeItems. Owner could be user (wilkyrlx), organization, class, etc.
    let ownerMap: Map<string, stripeItem[]> = new Map();
    const newItems = items.slice();

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

    // for each owner, create a new directory where the childer are the list of stripeItem repos
    // do not create a directory for the personal repos
    ownerMap.forEach((ownerDirectory: stripeItem[], ownerName: string) => {
        if (ownerName === personalName && !makePersonalDirectory) {
            newItems.push.apply(newItems, ownerDirectory)
        } else {
            newItems.push(new stripeItem({ name: ownerName, link: "#", typeItem: stripeItemType.DIRECTORY, children: ownerDirectory }))
        }
    })

    setItems(newItems);
}

// mocks an API call, use in place of githubAPIResponse
async function mockAPIResponse(): Promise<Repo[]> {
    const repoListFull: Repo[] = [];

    repoListFull.push(new Repo("ccg", "brown-ccg/ccg", "https://github.com/brown-ccg/ccg-website", "brown-ccg"));
    repoListFull.push(new Repo("ccg-tools", "brown-ccg/ccg-tools", "https://github.com/brown-ccg", "brown-ccg"));
    repoListFull.push(new Repo("esgaroth2", "wilkyrlx/esgaroth", "https://github.com/wilkyrlx/esgaroth", "wilkyrlx"));

    return repoListFull;
}


export { readGithub }