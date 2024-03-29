import { NextApiResponse, NextApiRequest } from "next";
import credentials from "../../../../constants";
import { Oauth, github, twitter } from "../../../../oauth";

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
  TWITTER_CALLBACK,
} = credentials;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { provider } = req.query;
  if (!provider) {
    return { statusCode: 404 };
  }
  const oauth = await Oauth({
    twitter: twitter({
      clientId: TWITTER_CLIENT_ID,
      clientSecret: TWITTER_CLIENT_SECRET,
      callback: TWITTER_CALLBACK,
    }),
    github: github({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callback: GITHUB_CALLBACK,
    }),
  });
  const profile = await oauth.getProfile(provider as string, req);
  const encoded = encodeURIComponent(JSON.stringify(profile));
  res.redirect(`http://localhost:4000/test/?profile=${encoded}`);
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
