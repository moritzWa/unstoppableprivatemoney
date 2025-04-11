export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  hasSubscription?: boolean;
  stripeCustomerId?: string;
  isWaitlisted?: boolean;
  tokenVersion?: number;
}

export interface Bounty {
  id: string;
  name: string;
  openStatus: boolean;
  organisation: string;
  submitLink: string;
  contactLink: string;
  skills: string;
  prizes: string;
  prizeCurrency: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organisation {
  id: string;
  name: string;
  logo: {
    contentType: string;
  };
  contactLink: string;
  createdAt: string;
  updatedAt: string;
}
