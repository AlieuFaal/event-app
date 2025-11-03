import { Hono } from "hono";
import { db, eventSchema, schema } from "@vibespot/database";
import { auth } from "@vibespot/database/src/auth";
import { zValidator } from "@hono/zod-validator";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().get("/", async (c) => {
  //   const userId = c.var.user?.id;
  //   if (!userId) {
  //     console.log("No user in session.");
  //     throw new Error("User not authenticated");
  //   }
  const events = await db.select().from(schema.event);
  return c.json(events);
});

export default app;
