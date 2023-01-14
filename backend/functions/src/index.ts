import axios from "axios";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import * as functions from "firebase-functions";
import { get } from "lodash";
import { Octokit } from "octokit";
import jwt from "jsonwebtoken";
import querystring from "querystring";
import { generalHandler } from "./handlers/generalHandler";
import { orgsHandler } from "./handlers/orgsHandler";
import { teamsHandler } from "./handlers/teamsHandler";
import { githubClientID, githubClientSecret } from "./private/GithubKey";
import { GithubResponse } from "./util/responseShape";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// TODO: manage user provisions via https://console.cloud.google.com/functions/list?authuser=1&project=github-folders&supportedpurview=project

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

const app = express();

app.use(cors({ origin: true }));
app.use(cookieParser());



const GITHUB_CLIENT_ID: string = process.env.NODE_GITHUB_CLIENT_ID || "NO ENV";
const GITHUB_CLIENT_SECRET: string = process.env.NODE_GITHUB_CLIENT_SECRET || "NO ENV";
// TODO: rewatch tutorial to check what the difference between secrets is
const secret = githubClientSecret;
// multiple cookies for different data
const COOKIE_GENERAL = "github-jwt-general";
const COOKIE_ORGS = "github-jwt-orgs";
const COOKIE_TEAMS = "github-jwt-teams";



async function getGithubTotal(code: string): Promise<GithubResponse[]> {
  const githubToken = await axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
    )
    .then((res) => res.data)

    .catch((error) => {
      throw error;
    });

  // TODO: better type checking
  const decodedAccessToken: string = querystring.parse(githubToken).access_token as string;
  const octokit = new Octokit({
    auth: decodedAccessToken
  })
  console.log("octokit token: ", decodedAccessToken);
  const general: GithubResponse = await generalHandler(octokit);
  const orgs: GithubResponse = await orgsHandler(octokit);
  const teams: GithubResponse = await teamsHandler(octokit);
  return [general, orgs, teams];
}

app.get("/api/auth/github", async (req: Request, res: Response) => {
  functions.logger.log("auth github and version is: " + githubClientID);
  // TODO: check if code is valid
  const code: string = get(req, "query.code") as string;
  const path = get(req, "query.path", "/");

  if (!code) {
    throw new Error("No code!");
  }

  // const totalResponse: GithubResponse[] = await getGithubTotal(code);
  // const githubGeneral: GithubResponse = totalResponse[0];
  // const githubOrgs: GithubResponse = totalResponse[1];
  // const githubTeams: GithubResponse = totalResponse[2];

  // mock responses
  const githubGeneral: GithubResponse = { status: "ok", data: [{ name: "general", html_url: "https://github.com", owner: "xx" }] };
  const githubOrgs: GithubResponse = { status: "ok", data: [{ name: "orgs", html_url: "https://github.com", owner: "xx" }] };
  const githubTeams: GithubResponse = { status: "ok", data: [{ name: "teams", html_url: "https://github.com", owner: "x" }] };

  generateCookiesFromResponse(res, githubGeneral, COOKIE_GENERAL);
  generateCookiesFromResponse(res, githubOrgs, COOKIE_ORGS);
  generateCookiesFromResponse(res, githubTeams, COOKIE_TEAMS);

  res.redirect(`http://localhost:3000${path}`);
});

// FIXME: need to check if total cookie size is too big and develop an acceptable workaround
// consider using localStorage or sessionStorage
function generateCookiesFromResponse(res: Response, githubRes: GithubResponse, cookieName: string) {
  const token: string = jwt.sign(githubRes, secret);
  console.log(`token for ${cookieName}: ${githubRes}`);

  // TODO: check if cookie is too big
  const byteLengthUtf8 = (str: string) => new Blob([str]).size
  console.log(`bytes in cookie ${cookieName}: ${byteLengthUtf8(token)}`);

  res.cookie(cookieName, token, {
    httpOnly: true,
    domain: "localhost",
  });
}

// =============================================================================
// DATA ENDPOINTS - return minimum JSON data needed for frontend, parsed from github API
// =============================================================================

// endpoint for general data (user repos, collab repos, etc.)
app.get("/api/general", (req: Request, res: Response) => {
  var cookie;
  cookie = get(req, `cookies[${COOKIE_GENERAL}]`);
  try {
    const decode = jwt.verify(cookie, secret);
    return res.send(decode);
  } catch (e) {
    console.log(e);
    return res.send(null);
  }
});

// endpoint for orgs data (user's orgs)
app.get("/api/orgs", (req: Request, res: Response) => {
  var cookie;
  cookie = get(req, `cookies[${COOKIE_ORGS}]`);
  try {
    const decode = jwt.verify(cookie, secret);
    return res.send(decode);
  } catch (e) {
    console.log(e);
    return res.send(null);
  }
});

// endpoint for teams data (repos in user's teams)
app.get("/api/teams", (req: Request, res: Response) => {
  var cookie;
  cookie = get(req, `cookies[${COOKIE_TEAMS}]`);
  try {
    const decode = jwt.verify(cookie, secret);
    return res.send(decode);
  } catch (e) {
    console.log(e);
    return res.send(null);
  }
});

// TODO: make this endpoint return the user's github username
app.get("/api/user", (req: Request, res: Response) => {
  const mockUser = { status: "success", user: "wilkyrlx" };
  return res.send(mockUser);
});

exports.app = functions.https.onRequest(app);
