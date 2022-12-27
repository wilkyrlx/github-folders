import { useState, useEffect } from "react";
import axios from "axios";
import { githubClientID } from "../private/GithubKey";

const GITHUB_CLIENT_ID = githubClientID;
const gitHubRedirectURL = "http://localhost:4000/api/auth/github";
const path = "/";

function OAuthInterface() {
  const [user, setUser] = useState();

  useEffect(() => {
    (async function () {
      const usr = await axios
        .get(`http://localhost:4000/api/me`, {
          withCredentials: true,
          credentials: 'include', // Don't forget to specify this if you need cookies
        })
        .then((res) => res.data)
        .then((data) => console.log(data));

      // setUser(usr);
    })();
  }, []);

  // TODO: verify all this scope is necessary
  const scope = "admin:org admin:public_key admin:repo_hook project repo user";
  return (
    <div className="App">
      {!user ? (
        <a
          href={`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${gitHubRedirectURL}?path=${path}&scope=${scope}`}
        >
          LOGIN WITH GITHUB
        </a>
      ) : (
        <div>
          <h1>Welcome {user.login}</h1>
        </div>
      ) }
    </div>
  );
}

export default OAuthInterface;