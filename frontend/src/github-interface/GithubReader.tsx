import { Octokit } from "octokit"
import { githubToken } from "../private/GithubKey"

async function getAllRepos() {
    const token = githubToken

    // Octokit.js
    // https://github.com/octokit/core.js#readme
    const octokit = new Octokit({
        auth: token
    })

    const response = await octokit.request('GET /user/repos{?visibility,affiliation,type,sort,direction,per_page,page,since,before}', {})
    console.log(await response.data);
    response.data.forEach((element: any) => {
        console.log(element)
    })

    fetch(`https://api.github.com/user/repos`,{
        method: "GET",
        headers: {
          Authorization: `token ` + token 
        }
      })
        .then(data => data.json())
        .then(jsonData => console.log(jsonData))
}


export { getAllRepos }