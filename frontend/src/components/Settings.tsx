import { useEffect, useState } from 'react';
import { StripeItemsProps } from '../App';
import { readGithub } from '../scripts/GithubReader';
import { githubClientID } from '../private/GithubKey';
import '../styles/Settings.css';

// Constants for OAuth URL
const GITHUB_CLIENT_ID = githubClientID;
const gitHubRedirectURL = "http://localhost:4000/api/auth/github";
const PATH = "/";
const SCOPE = "admin:org admin:public_key admin:repo_hook project repo user";

const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${gitHubRedirectURL}?path=${PATH}&scope=${SCOPE}`;



function Settings(itemsPack: StripeItemsProps) {

    return (
        <div id="settings">
            <h3>Link your Github Account</h3>
            <OAuthInterface {...itemsPack}/>
            <br></br>
        </div>
    )
}

function OAuthInterface(appPack: StripeItemsProps) {

    // TODO: This is a hacky way to get the user name to display on the button
    useEffect(() => {
        authUserName();
      }, []);

    const [user, setUser] = useState<string>("Link Account");

    async function authUserName() {
        const backendRaw = await fetch('http://localhost:4000/api/user');
        const backendJson = await backendRaw.json();
        const userName: string = backendJson.user;
        // TODO: test that this works
        if (userName) {
            setUser(`Welcome, ${userName}`);
        }
    }

    return (
        <div>
            {/* wrap this to preserve state*/}
            <a href={AUTH_URL} onClick={() => authUserName()} style={{textDecoration:"none"}}>
                <button type="button" className="button">
                    <span className="button_text">{user}</span>
                    <span className="button_icon">
                        <img src='/icons/github-logo.png' className='github-img'></img>
                    </span>
                </button>
            </a>
        </div>
    )

}

export { Settings }