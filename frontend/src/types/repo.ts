// Class that represents a repository. Used with Github API
export class Repo {
    name: string
    html_url: string
    owner: string
    constructor (name: string, html_url:string, owner:string) {
        this.name = name
        this.html_url = html_url
        this.owner = owner
    }
}