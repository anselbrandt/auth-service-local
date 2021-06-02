import fetch from "node-fetch";
import { Credentials } from "../types";
import { NextApiRequest } from "next";

export const github = (credentials: Credentials) => {
  const { clientId, clientSecret, callback } = credentials;

  const accessToken = {
    baseUrl: "https://github.com/login/oauth/access_token",
    params: (code: string) => {
      client_id: clientId;
      client_secret: clientSecret;
      code: code;
    },
  };
  const profile = {
    baseUrl: "https://api.github.com/user",
  };

  const getRedirect = async () => {
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callback}&scope=user%3Aemail`;
  };

  const getGithubAccessToken = async (req: NextApiRequest) => {
    const code = req.query.code;
    const response = await fetch(
      `${accessToken.baseUrl}?client_id=${credentials.clientId}&client_secret=${credentials.clientSecret}&code=${code}&redirect_uri=${credentials.callback}`,
      {
        method: "POST",
      }
    );
    const body = await response.text();
    const oauthResponse: any = body
      .split("&")
      .reduce((accumulator, current) => {
        const [k, v] = current.split("=");
        return Object.assign(accumulator, { [k]: v });
      }, {});
    const { access_token } = oauthResponse;
    return access_token;
  };

  const getProfile = async (req: NextApiRequest) => {
    const accessToken = await getGithubAccessToken(req);
    const fetchedProfile = await fetch(profile.baseUrl, {
      method: "GET",
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const userProfile = await fetchedProfile.json();

    const fetchedEmail = await fetch("https://api.github.com/user/emails", {
      method: "GET",
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const userEmails = await fetchedEmail.json();

    const userEmail = userEmails[0];

    return { ...userProfile, ...userEmail };
  };

  return {
    getRedirect,
    getProfile,
  };
};
