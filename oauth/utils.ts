import crypto from "crypto";

export function getAuthString(
  baseURL: string,
  params: object,
  secret: string[],
  method: string
) {
  function fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }

  const paramString = Object.entries(params)
    .map(([k, v]: [any, any]) => [
      fixedEncodeURIComponent(k),
      fixedEncodeURIComponent(v),
    ])
    .sort()
    .map((entry) => entry.join("="))
    .join("&");

  const baseString = `${method}&${fixedEncodeURIComponent(
    baseURL
  )}&${fixedEncodeURIComponent(paramString)}`;

  const signingKey =
    secret.length === 1
      ? `${fixedEncodeURIComponent(secret[0])}&`
      : `${fixedEncodeURIComponent(secret[0])}&${fixedEncodeURIComponent(
          secret[1]
        )}`;

  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  const headerParams = Object.fromEntries(
    Object.entries(params).map(([k, v]: [any, any]) => [
      k,
      `${fixedEncodeURIComponent(v)}`,
    ])
  );

  const signedParams = {
    ...headerParams,
    ["oauth_signature"]: `${fixedEncodeURIComponent(signature)}`,
  };

  const headerString = Object.entries(signedParams)
    .map((entry) => entry.join("="))
    .join(",");

  return `OAuth ${headerString}`;
}
