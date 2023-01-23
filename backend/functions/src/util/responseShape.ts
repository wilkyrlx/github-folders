
export interface apiObject {
    name: string;
    html_url: string;
    owner: string;
}

export interface GithubResponse {
    status: string;
    data: apiObject[];
}