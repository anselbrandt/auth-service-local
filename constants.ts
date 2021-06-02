const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string;

const GITHUB_CLIENT_SECRET = process.env
  .NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string;

const GITHUB_CALLBACK =
  process.env.NEXT_PUBLIC_GITHUB_CALLBACK ||
  "http://localhost:3000/api/auth/callback/github";

const TWITTER_CLIENT_ID = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string;

const TWITTER_CLIENT_SECRET = process.env
  .NEXT_PUBLIC_TWITTER_CLIENT_SECRET as string;

const TWITTER_CALLBACK =
  process.env.NEXT_PUBLIC_TWITTER_CALLBACK ||
  "http://localhost:3000/api/auth/callback/twitter";

const credentials = {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
  TWITTER_CALLBACK,
};

export default credentials;
