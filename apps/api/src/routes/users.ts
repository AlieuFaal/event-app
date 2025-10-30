import { Hono } from "hono";
import {
  db,
  schema,
  userFormSchema,
  onboardingSchema,
  onbFormUpdateSchema,
  roleUpdateSchema,
  userSchema,
  eq,
  and,
  count,
} from "@vibespot/database";
import { auth } from "@vibespot/database/src/auth";
import { zValidator } from "@hono/zod-validator";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .get("/", async (c) => {
    const userId = c.req.param("id");
    //   if (!userId) {
    //     console.log("No user in session.");
    //     throw new Error("User not authenticated");
    //   }

    const users = await db.select().from(schema.user);
    return c.json(users);
  })
  .get("/:id", async (c) => {
    const userId = c.req.param("id");
    //   if (!userId) {
    //     console.log("No user in session.");
    //     throw new Error("User not authenticated");
    //   }

    const userById = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId!))
      .limit(1)
      .then((res) => res[0]);

    return c.json(userById);
  })
  .put("/updateroletouser/:id", async (c) => {
    const userId = c.req.param("id");

    const result = await db
      .update(schema.user)
      .set({
        role: "user",
      })
      .where(eq(schema.user.id, userId!))
      .returning();

    return c.json(result[0]);
  })
  .put("/updateroletoartist/:id", async (c) => {
    const userId = c.req.param("id");

    const result = await db
      .update(schema.user)
      .set({
        role: "artist",
      })
      .where(eq(schema.user.id, userId!))
      .returning();

    return c.json(result[0]);
  })
  .put("/updaterole/:id", zValidator("json", roleUpdateSchema), async (c) => {
    const userId = c.req.param("id");
    const data = c.req.valid("json");

    const result = await db
      .update(schema.user)
      .set({
        role: data.role,
      })
      .where(eq(schema.user.id, userId!))
      .returning();

    return c.json(result[0]);
  })
  .put(
    "/updateonboardinginfo/:id",
    zValidator("json", onbFormUpdateSchema),
    async (c) => {
      const userId = c.req.param("id");
      const data = c.req.valid("json");

      const result = await db
        .update(schema.user)
        .set({
          phone: data.phone,
          location: data.location,
        })
        .where(eq(schema.user.id, userId!))
        .returning();

      return c.json(result[0]);
    }
  );

export default app;
