import { Octokit } from "octokit"
import { StripeItemsProps } from "../App"
import { stripeItem, stripeItemType } from "../components/StripeItem"
import { Repo } from "../data/Repo"
import { githubToken } from "../private/GithubKey"

async function readGithub({setItems, items}: StripeItemsProps) {
    getAllRepos({setItems, items}, githubAPIResponse())
}

async function githubAPIResponse(): Promise<Repo> {
    const token = githubToken
    const rawData = await fetch(`https://api.github.com/user/repos`,{
        method: "GET",
        headers: {
          Authorization: `token ` + token 
        }
      });
    const jsonData = await rawData.json()
    return await new Repo(jsonData[0].name, jsonData[0].full_name, jsonData[0].html_url)
}

async function mockAPIResponse(): Promise<Repo> {
    const fileContents: string = `[    {
        "name": "brown-poker",
        "full_name": "wilkyrlx/brown-poker",
        "private": false,
        "owner": {
          "login": "wilkyrlx",
          "type": "User",
          "site_admin": false
        },
        "html_url": "https://github.com/wilkyrlx/brown-poker",
        "url": "https://api.github.com/repos/wilkyrlx/brown-poker",
        "visibility": "public",
      }]`

    return JSON.parse(fileContents)
}

// TODO: fix types
async function getAllRepos({setItems, items}: StripeItemsProps, rawData:Promise<Repo>) {
    // gets current stripeItems
    const newItems = items.slice();
    const jsonData: Repo = await rawData;

    newItems.push(new stripeItem({ name: repo.name, link: repo.html_url, typeItem: stripeItemType.REPO , children: [] }));
    jsonData.forEach((repo: any) => {
        newItems.push(new stripeItem({ name: repo.name, link: repo.html_url, typeItem: stripeItemType.REPO , children: [] }));
    });

    setItems(newItems);
}


export { readGithub }