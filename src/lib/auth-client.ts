import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  // userFields: ["id", "name", "email", "image", "role", "bio", "location", "phone"],
});
