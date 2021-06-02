export interface Credentials {
  clientId: string;
  clientSecret: string;
  callback: string;
}

export interface Provider {
  getRedirect: () => Promise<string>;
  getProfile: (req: any) => Promise<object>;
}

export interface Providers {
  [name: string]: Provider;
}
