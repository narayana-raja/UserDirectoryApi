const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

export const isAuth0Configured = Boolean(domain && clientId);

export const auth0Config = {
  domain,
  clientId,
  authorizationParams: {
    redirect_uri: `${window.location.origin}/authentication/callback`,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE || "https://user-directory-api",
    scope: process.env.REACT_APP_AUTH0_SCOPE || "openid profile email"
  }
};
