import { Hono } from "hono";
import { db, event } from "@vibespot/database";
import { auth } from "@vibespot/database/src/auth";
import { authClient } from "../../lib/auth-client";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().post("/", async (c) => {
  const { email, password } = await c.req.json();

  try {
    const { data } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: "https://example.com/callback",
    });
    if (await authClient.getSession()) {
      return c.json({ message: "Sign in successful", data });
    } else {
      return c.json({ message: "Sign in failed" }, 401);
    }
  } catch (error) {
    return c.json({ message: "Error during sign in", error }, 500);
  }
});

export default app;
