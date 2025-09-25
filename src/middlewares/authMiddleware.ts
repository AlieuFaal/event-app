import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { c } from "node_modules/framer-motion/dist/types.d-Cjd591yU";
import { Route } from "@tanstack/react-router";

export const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getWebRequest();

    const session = await auth.api.getSession({ headers: request.headers });

    return next({
      context: {
        session,
      },
    });
  }
);
