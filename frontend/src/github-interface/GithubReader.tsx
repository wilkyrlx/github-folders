import { Octokit } from "octokit"
import { StripeItemsProps } from "../App"
import { stripeItem, stripeItemType } from "../components/StripeItem"
import { Repo } from "../data/repo"
import { githubToken } from "../private/GithubKey"

async function readGithub({setItems, items}: StripeItemsProps) {
    getAllRepos({setItems, items}, githubAPIResponse())
}

async function githubAPIResponse(): Promise<Repo[]> {
    const token = githubToken
    const rawData = await fetch(`https://api.github.com/user/repos`,{
        method: "GET",
        headers: {
          Authorization: `token ` + token 
        }
      });
    const jsonData = await rawData.json()
    // note: add better error catching here
    const repoListFull: Repo[] = []
    jsonData.forEach((repo: any) => {
        repoListFull.push(new Repo(repo.name, repo.full_name, repo.html_url));
    });
    return await repoListFull
}

// async function mockAPIResponse(): Promise<Repo[]> {
//     return blank
// }

async function getAllRepos({setItems, items}: StripeItemsProps, repoListPromise:Promise<Repo[]>) {
    const newItems = items.slice();
    const repoList: Repo[] = await repoListPromise;

    repoList.forEach((repo: Repo) => {
        newItems.push(new stripeItem({ name: repo.name, link: repo.html_url, typeItem: stripeItemType.REPO , children: [] }));
    });

    setItems(newItems);
}


export { readGithub }