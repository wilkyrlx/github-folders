// Class that represents a repository OR organization. Used to parse data from Github API
export class Repo {
    name: string        // name of repo or organization
    html_url: string    // url to repo or organization
    owner: string       // owner login of repo or organization login
    constructor (name: string, html_url:string, owner:string) {
        this.name = name
        this.html_url = html_url
        this.owner = owner
    }
}