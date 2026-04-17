import { createAuthClient } from "better-auth/react";

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const configuredBaseUrl = process.env.BETTER_AUTH_URL;
  if (!configuredBaseUrl) {
    throw new Error("BETTER_AUTH_URL environment variable is not set");
  }

  return configuredBaseUrl;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});
