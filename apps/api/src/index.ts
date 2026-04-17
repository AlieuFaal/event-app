import { type AuthType, auth } from "@vibespot/database/src/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import events from "./routes/events";
import users from "./routes/users";

const app = new Hono<{ Variables: AuthType }>({ strict: false });
const parseOrigins = (origins: string | undefined): string[] => {
	if (!origins) {
		return [];
	}

	return origins
		.split(",")
		.map((origin) => origin.trim())
		.filter((origin) => origin.length > 0);
};

const defaultAllowedOrigins = [
	"http://localhost:3000",
	"http://localhost:3001",
	"http://localhost:8081",
	"http://10.0.2.2:3001",
];
const configuredOrigins = parseOrigins(process.env.API_ALLOWED_ORIGINS);
const allowedOrigins = new Set(
	configuredOrigins.length > 0 ? configuredOrigins : defaultAllowedOrigins,
);

app.use(
	"/*",
	cors({
		origin: (origin) => {
			if (!origin) {
				return undefined;
			}

			return allowedOrigins.has(origin) ? origin : undefined;
		},
		allowHeaders: ["Content-Type", "Authorization", "Cookie"],
		allowMethods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

// Better Auth handler
app.on(["POST", "GET"], "/api/auth/*", (c) => {
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
