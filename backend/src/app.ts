import express, { Request, Response } from "express";
import querystring from "querystring";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import cookieParser from "cookie-parser";
import axios from "axios";
import cors from "cors";
import { githubToken, githubClientID, githubClientSecret } from "./private/GithubKey";
import { generalAPI, mockResponse, testAPI } from "./handlers/githubHandler";

const app = express();
app.use(cookieParser());

const GITHUB_CLIENT_ID = githubClientID;
const GITHUB_CLIENT_SECRET = githubClientSecret;
const secret = githubClientSecret;
const COOKIE_NAME = "github-jwt";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: null;
  blog: string;
  location: string;
  email: null;
  hireable: null;
  bio: null;
  twitter_username: null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: Date;
  updated_at: Date;
}

async function getGitHubUser({ code }: { code: string }): Promise<any> {
  const githubToken = await axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
    )
    .then((res) => res.data)

    .catch((error) => {
      throw error;
    });

  const decoded = querystring.parse(githubToken);

  const x = testAPI(decoded.access_token as string)
  return x;

  const accessToken = decoded.access_token;

  return axios
    .get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Error getting user from GitHub`);
      throw error;
    });
}

app.get("/api/auth/github", async (req: Request, res: Response) => {
  const code = get(req, "query.code");
  const path = get(req, "query.path", "/");

  if (!code) {
    throw new Error("No code!");
  }

  // const gitHubUser = await getGitHubUser({ code });
  const gitHubUser = mockResponse;

  const inputString: string = JSON.stringify(gitHubUser).toString();

  let token: string = "empty token"
  try {
    token = jwt.sign(gitHubUser, secret);
  } catch (error) {
    console.error(error);
  }
  console.log(token + " token");
  try {
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      domain: "localhost",
    });
    console.log("cookie set");
  } catch (error) {
    console.log(error + "with cookie");
  }


  res.redirect(`http://localhost:3000${path}`);
});

app.get("/api/me", (req: Request, res: Response) => {
  var cookie;

  try {
    cookie = get(req, `cookies[${COOKIE_NAME}]`);
    console.log(cookie+ "cookie get")

  } catch (error) {
    console.log(error + "with cookie get")
  }

  try {
    const decode = jwt.verify(cookie, secret);
    console.log(JSON.stringify(decode) + "decode worked as inteneded")
    return res.send(decode);
  } catch (e) {
    console.log(e);
    return res.send(null);
  }
});

app.listen(4000, () => {
  console.log("Server is listening");
});
