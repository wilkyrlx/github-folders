import axios from "axios";
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
import { GithubResponse } from "./util/responseShape";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// TODO: manage user provisions via https://console.cloud.google.com/functions/list?authuser=1&project=github-folders&supportedpurview=project

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

const GITHUB_CLIENT_ID: string = process.env.NODE_GITHUB_CLIENT_ID || "NO ENV";
const GITHUB_CLIENT_SECRET: string = process.env.NODE_GITHUB_CLIENT_SECRET || "NO ENV";
const ENCRYPTION_SECRET: string = process.env.NODE_ENCRYPTION_SECRET || "NO ENV";


async function getGithubToken(code: string): Promise<string> {
  const githubToken = await axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log("error: ", err);
      return "ERROR";
    });

  // TODO: better type checking
  const decodedAccessToken: string = querystring.parse(githubToken).access_token as string;
  console.log("octokit token: ", decodedAccessToken);
  return decodedAccessToken;
}

app.get("/api/auth/github", async (req: Request, res: Response) => {
  // TODO: check if code is valid to prevent errors
  const code: string = get(req, "query.code") as string;
  const path = get(req, "query.path", "/");

  if (!code) {
    throw new Error("No code!");
  }

  // FIXME: remove the hardcoded token, this is the error point. Something with CORS?
  const rawToken: string = await getGithubToken(code) || "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";
  console.log("raw token: ", rawToken);
  
  // TODO: change to encrypt, jwt just encodes
  const encryptedToken: string = rawToken;
  res.redirect(`http://localhost:3000${path}?token=${encryptedToken}`);
});



// =============================================================================
// DATA ENDPOINTS - return minimum JSON data needed for frontend, parsed from github API
// =============================================================================

// TODO: add error handling for all handlers
// endpoint for general data (user repos, collab repos, etc.)
app.get("/api/general", async (req: Request, res: Response) => {
  return handleGithubResponse(req, res, generalHandler);
});

// endpoint for orgs data (user's orgs)
app.get("/api/orgs", async (req: Request, res: Response) => {
  return handleGithubResponse(req, res, orgsHandler);
});

// endpoint for teams data (user's teams)
app.get("/api/teams", async (req: Request, res: Response) => {
  return handleGithubResponse(req, res, teamsHandler);
});

/**
 * Sends a JSON GithubResponse with repos/orgs given a token from the request params
 * @param req - a request with a token in the query params
 * @param res - a response to send the data
 * @param handler - a function that accesses the Github API via Octokit
 *  and returns a GithubResponse
 */
async function handleGithubResponse(req: Request, res: Response, handler: (octokit: Octokit) => Promise<GithubResponse>) {
  const token: string = get(req, "query.token") as string;
  const octokit = new Octokit({ auth: token, });

  //const data: GithubResponse = { status: "success", data: [{ name: "general", html_url: "https://github.com", owner: "xx" }] };
  const data: GithubResponse = await handler(octokit);

  if (data.status === "success") {
    return res.send(data);
  } else {
    // TODO: does this work
    return res.status(500).send({ error: handler.name + " error" });
  }
}


// TODO: make this endpoint return the user's github username
app.get("/api/user", (req: Request, res: Response) => {
  const mockUser = { status: "success", user: "wilkyrlx" };
  return res.send(mockUser);
});

exports.app = functions.https.onRequest(app);
