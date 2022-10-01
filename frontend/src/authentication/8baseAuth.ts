import { AUTH_STRATEGIES, Auth } from "@8base/auth";

const domain = import.meta.env.VITE_AUTH_DOMAIN;
const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;

const logoutRedirectUri = `${window.location.origin}/logout`;
const redirectUri = `${window.location.origin}/auth/callback`;

export const authClient = Auth.createClient(
  {
    strategy: AUTH_STRATEGIES.WEB_COGNITO,
  },
  {
    domain,
    clientId,
    logoutRedirectUri,
    redirectUri,
  }
);
