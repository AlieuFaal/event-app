import { createAuthClient } from "better-auth/react";
import { customSessionClient } from "better-auth/client/plugins";
import { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.VITE_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});