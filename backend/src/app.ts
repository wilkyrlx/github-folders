import express, { Request, Response } from "express";
import querystring from "querystring";
import jwt from "jsonwebtoken";
import { get } from "lodash";
import cookieParser from "cookie-parser";
import axios from "axios";
import cors from "cors";
import { githubToken, githubClientID, githubClientSecret } from "./private/GithubKey";
import { generalAPI, mockResponse, testAPI } from "./handlers/githubHandler";
import { GithubResponse } from "./util/responseShape";
import { Octokit } from "octokit";
import { orgsHandler } from "./handlers/orgsHandler";
import { generalHandler } from "./handlers/generalHandler";
import { teamsHandler } from "./handlers/teamsHandler";

const app = express();
app.use(cookieParser());

const GITHUB_CLIENT_ID = githubClientID;
const GITHUB_CLIENT_SECRET = githubClientSecret;
// TODO: rewatch tutorial to check what the difference between secrets is
const secret = githubClientSecret;
// TODO: multiple cookies for different data
const COOKIE_NAME = "github-jwt";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


async function getGitHubUser({ code }: { code: string }): Promise<GithubResponse> {
  const githubToken = await axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
    )
    .then((res) => res.data)

    .catch((error) => {
      throw error;
    });

  const decoded = querystring.parse(githubToken);
  const octokit = new Octokit({
    //TODO: use oauth
    auth: decoded.access_token as string
  })
  const x = teamsHandler(octokit)
  return x;
}

app.get("/api/auth/github", async (req: Request, res: Response) => {
  const code = get(req, "query.code");
  const path = get(req, "query.path", "/");

  if (!code) {
    throw new Error("No code!");
  }

  const gitHubUser = await getGitHubUser({ code });

  const token = jwt.sign(gitHubUser, secret);

  console.log(token + " token");

  // TODO: check if cookie is too big
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    domain: "localhost",
  });

  res.redirect(`http://localhost:3000${path}`);
});

app.get("/api/me", (req: Request, res: Response) => {
  var cookie;
  cookie = get(req, `cookies[${COOKIE_NAME}]`);


  try {
    const decode = jwt.verify(cookie, secret);
    return res.send(decode);
  } catch (e) {
    console.log(e);
    return res.send(null);
  }
});

app.listen(4000, () => {
  console.log("Server is listening");
});
