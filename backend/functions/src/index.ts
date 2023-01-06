import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import * as functions from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// TODO: manage user provisions via https://console.cloud.google.com/functions/list?authuser=1&project=github-folders&supportedpurview=project

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const app = express();

// FIXME: these do not work with firebase functions
app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// TODO: make this endpoint return the user's github username
app.get("/api/user", (req: Request, res: Response) => {
  const mockUser = { status: "success", user: "wilkyrlx" };
  return res.send(mockUser);
});



app.listen(4000, () => {
  console.log("Server is listening");
});

exports.app = functions.https.onRequest(app);
