// Class that represents a repository
export class Repo {
    name: string
    full_name: string
    html_url: string
    constructor (name: string, full_name: string, html_url:string) {
        this.name = name
        this.full_name = full_name
        this.html_url = html_url
    }
}