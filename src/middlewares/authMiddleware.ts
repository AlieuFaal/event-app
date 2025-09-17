import { authClient } from "@/lib/auth-client";
import { auth } from "@/utils/auth";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { c } from "node_modules/framer-motion/dist/types.d-Cjd591yU";

export const authMiddleware = createMiddleware({type: "function"}).server(async ({ next }) => {
  const request = getWebRequest();

  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      throw new Error("Unauthorized");
    }

    return next({
      context: {
        session,
      },
    });
  } catch (error) {
    throw new Error("Authentication failed");
  }
});
