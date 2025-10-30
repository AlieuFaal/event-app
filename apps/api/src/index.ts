import { Hono } from "hono";
import { cors } from "hono/cors";
import events from "./routes/events";
import users from "./routes/users";
import { auth } from "@vibespot/database/src/auth";
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

// CORSSSSS
app.use(
  "/*",
  cors({
    origin: (origin) => origin,
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"], 
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  })
);

// Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// Middleware
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

app.get("/session", (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session) return c.body(null, 401);

  return c.json({
    session,
    user,
  });
});

app.get("/", (c) => {
  return c.json({ message: "Welcome to the VibeSpot API!" });
});

// Register routes
const routes = app.route("/events", events).route("/users", users);

// Export the routes type
export type AppType = typeof routes;

export default {
  port: 3001,
  fetch: app.fetch,
};
