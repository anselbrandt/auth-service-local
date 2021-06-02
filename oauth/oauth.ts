import { Providers } from "./types";
import { NextApiRequest } from "next";

export const Oauth = async (providers: Providers) => {
  const getRedirect = async (provider: string) =>
    await providers[provider].getRedirect();

  const getProfile = async (provider: string, req: NextApiRequest) =>
    await providers[provider].getProfile(req);

  return { getRedirect, getProfile };
};
