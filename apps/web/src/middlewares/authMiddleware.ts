import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@vibespot/database/src/auth";
import { getWebRequest } from "@tanstack/react-start/server";

export const authMiddleware = createMiddleware({ type: "function" })
  .server(async ({ next }) => {
    const request = getWebRequest();

    const session = await auth.api.getSession({ headers: request.headers });

    return next({
      context: {
        session: session,
        currentUser: session?.user,
        IsAuthenticated: !!session,
      },
    });
  });