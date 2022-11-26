import { Octokit } from "octokit"
import { StripeItemsProps } from "../App"
import { stripeItem, stripeItemType } from "../data/StripeItem"
import { Repo } from "../data/repo"
import { githubToken } from "../private/GithubKey"

/**
 * Generally, this function reads repos from the github API. Has mock testing capability
 * This is the only function that the model has access to
 * 
 * @param StripeItemProps - props to set new stripeItems and read existing stripeItems
 */
async function readGithub({setItems, items}: StripeItemsProps) {
    // second param can be mockAPIRepsonse() or githubAPIResponse(). Latter for deployment
    addGithubRepos({setItems, items}, mockAPIResponse())
}

/**
 * Fetches a list of user repos from github API with auth, including fields from
 * the Repo class such as (but not limited to) name, full_name, html_url.
 * 
 * Note: this function returns ALL repos, and does not filter. Unless moving that 
 * functionality here makes sense from an API interaction standpoint, filtering will be,
 * controlled in addGithubRepos
 * 
 * @returns a list of all Repo with certain fields from JSON output
 */
async function githubAPIResponse(): Promise<Repo[]> {
    // TODO: make authentication oauth, not hardcoded key
    const token = githubToken

    const rawData = await fetch(`https://api.github.com/user/repos`,{
        method: "GET",
        headers: {
          Authorization: `token ` + token 
        }
    });
    
    // TODO: add better error catching here
    const jsonData = await rawData.json()
    const repoListFull: Repo[] = []
    jsonData.forEach((repo: any) => {
        repoListFull.push(new Repo(repo.name, repo.full_name, repo.html_url));
    });
    return repoListFull
}

async function mockAPIResponse(): Promise<Repo[]> {
    const repoListFull: Repo[] = []
    repoListFull.push(new Repo("ccg", "brown-ccg/ccg", "#"));
    return repoListFull

}

async function addGithubRepos({setItems, items}: StripeItemsProps, repoListPromise:Promise<Repo[]>) {
    const repoList: Repo[] = await repoListPromise;

    const newItems = items.slice();
    repoList.forEach((repo: Repo) => {
        newItems.push(new stripeItem({ name: repo.name, link: repo.html_url, typeItem: stripeItemType.REPO , children: [] }));
    });
    setItems(newItems);
}


export { readGithub }