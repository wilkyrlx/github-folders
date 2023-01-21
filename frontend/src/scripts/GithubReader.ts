import { StripeItemsProps } from "../App"
import { stripeItem, stripeItemType } from "../types/StripeItem"
import { Repo } from "../types/repo"

// TODO: endpoints need token param
// TODO: better error checking with env file
const BASE_URL: string = process.env.REACT_APP_BASE_URL as string;
const GENERAL_ENDPOINT = BASE_URL + `/api/general`;
const ORGS_ENDPOINT = BASE_URL + `/api/orgs`;
const TEAMS_ENDPOINT = BASE_URL + `/api/teams`;
 

/**
 * Generally, this function reads repos from the github API. It then adds them to the stripeItems
 * This is the only function that the model has access to
 * 
 * @param StripeItemProps - props to set new stripeItems and read existing stripeItems
 */
async function readGithub({ setItems, items }: StripeItemsProps) {
    const queryParameters = new URLSearchParams(window.location.search)
    const rawToken: string = queryParameters.get("token") as string;
    const tokenForURL = `?token=${rawToken}`

    const generalRepos: Repo[] = await getBackendResponse(GENERAL_ENDPOINT + tokenForURL);
    const teamRepos: Repo[] = await getBackendResponse(TEAMS_ENDPOINT + tokenForURL);
    generalRepos.concat(teamRepos);

    // TODO: option for user name and generate folders
    const githubRepos = await addGithubRepos(generalRepos, "wilkyrlx", false);
    const githubOrgs = await addGithubOrgs(getBackendResponse(ORGS_ENDPOINT + tokenForURL));

    let newItems = items.slice();
    const allItems = [...newItems, ...githubRepos, ...githubOrgs];
	setItems(allItems);
}



//========================= Backend Mechanics ==================================

async function getBackendResponse(endpoint: string): Promise<Repo[]> {
    const repoListFull: Repo[] = [];

    const backendRaw = await fetch(endpoint);
    const backendJson = await backendRaw.json();
    const backendData = await backendJson.data;

    for(const repo of backendData) {
        
        repoListFull.push(new Repo(repo.name, repo.html_url, repo.owner));
       
    };
    return repoListFull;
}

//========================= Add Mechanics ======================================

/**
 * 
 * @param StripeItemProps - props to set new stripeItems and read existing stripeItems 
 * @param repoListPromise - list of all Repos, unfiltered
 * @param personalName - name of personal github account. I.e. user wilkyrlx would be "wilkyrlx"
 * @param makePersonalDirectory - false normally, true if user wants a separate directory for personal repos
 */
async function addGithubRepos(repoListPromise: Repo[], personalName: string, makePersonalDirectory: boolean): Promise<stripeItem[]> {
    const repoList: Repo[] = repoListPromise;
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
        const codedName = `org/${org.name}`;
        addItems.push(new stripeItem({ name: codedName, link: org.html_url, typeItem: stripeItemType.ORGANIZATION, children: [] }))
    })

    return addItems;    
}

export { readGithub }