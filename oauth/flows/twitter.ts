import { v4 } from "uuid";
import fetch from "node-fetch";
import { getAuthString } from "../utils";
import { Credentials } from "../types";
import { NextApiRequest } from "next";

export const twitter = (credentials: Credentials) => {
  const { clientId, clientSecret, callback } = credentials;

  const redirect = {
    baseUrl: (token: string) =>
      `https://api.twitter.com/oauth/authorize?oauth_token=${token}`,
  };
  const requestToken = {
    baseUrl: "https://api.twitter.com/oauth/request_token",
    params: {
      oauth_consumer_key: clientId,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_nonce: v4(),
      oauth_version: "1.0",
      oauth_callback: callback,
    },
  };
  const accessToken = {
    baseUrl: (oauthToken: string, oauthVerifier: string) =>
      `https://api.twitter.com/oauth/access_token?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`,
  };
  const profile = {
    baseUrl: "https://api.twitter.com/1.1/account/verify_credentials.json",
    urlParams: "?include_email=true",
    params: (oauthToken: string) => ({
      include_email: true,
      oauth_consumer_key: clientId,
      oauth_token: oauthToken,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: Math.floor(Date.now() / 1000),
      oauth_nonce: v4(),
      oauth_version: "1.0",
    }),
  };

  const getRequestToken = async () => {
    const authString = getAuthString(
      requestToken.baseUrl,
      requestToken.params,
      [clientSecret],
      "POST"
    );
    const response = await fetch(requestToken.baseUrl, {
      method: "POST",
      headers: {
        Authorization: authString,
      },
    });

    const body = await response.text();

    const oauth: any = body
      .split("&")
      .map((entry) => entry.split("="))
      .reduce((accumulator, current) => {
        const [k, v] = current;
        return Object.assign(accumulator, { [k]: v });
      }, {});
    return oauth.oauth_token;
  };

  const getRedirect = async () => {
    const token = await getRequestToken();
    return redirect.baseUrl(token);
  };

  const getTwitterAccessToken = async (req: NextApiRequest) => {
    const oauthToken = req.query.oauth_token;
    const oauthVerifier = req.query.oauth_verifier;
    const response = await fetch(
      accessToken.baseUrl(oauthToken as string, oauthVerifier as string),
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
    const { oauth_token, oauth_token_secret } = oauthResponse;
    return { oauth_token, oauth_token_secret };
  };

  const getProfile = async (req: NextApiRequest) => {
    const accessToken = await getTwitterAccessToken(req);

    const authString = getAuthString(
      profile.baseUrl,
      profile.params(accessToken.oauth_token),
      [credentials.clientSecret, accessToken.oauth_token_secret],
      "GET"
    );

    const response = await fetch(`${profile.baseUrl}${profile.urlParams}`, {
      method: "GET",
      headers: {
        Authorization: authString,
      },
    });
    const userProfile = await response.json();
    return userProfile;
  };

  return {
    getRedirect,
    getProfile,
  };
};
