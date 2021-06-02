import credentials from "../constants";

export default function Home() {
  const { GITHUB_CALLBACK, TWITTER_CALLBACK } = credentials;
  return (
    <div>
      <div>{GITHUB_CALLBACK}</div>
      <br />
      <div>{TWITTER_CALLBACK}</div>
      <br />
    </div>
  );
}
