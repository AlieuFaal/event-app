import { Hono } from "hono";
import {
  db,
  schema,
  onbFormUpdateSchema,
  roleUpdateSchema,
  eq,
} from "@vibespot/database";
import { type AuthType } from "@vibespot/database/src/auth";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const userIdParamSchema = z.object({
  id: z.uuid(),
});

const sanitizeUserForViewer = (
  user: typeof schema.user.$inferSelect,
  viewerId: string
) => {
  if (user.id === viewerId) {
    return user;
  }

  return {
    ...user,
    email: "",
    phone: null,
    location: null,
  };
};

const app = new Hono<{ Variables: AuthType }>()
  .get("/", async (c) => {
    const sessionUserId = c.var.user?.id;

    if (!sessionUserId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const userById = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, sessionUserId))
      .limit(1)
      .then((result) => result[0]);

    if (!userById) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(userById);
  })
  .get("/:id", zValidator("param", userIdParamSchema), async (c) => {
    const sessionUserId = c.var.user?.id;
    const { id: userId } = c.req.valid("param");

    if (!sessionUserId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const userById = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1)
      .then((res) => res[0]);

    if (!userById) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(sanitizeUserForViewer(userById, sessionUserId));
  })
  .put(
    "/updateroletouser/:id",
    zValidator("param", userIdParamSchema),
    async (c) => {
      const sessionUserId = c.var.user?.id;
      const { id: userId } = c.req.valid("param");

      if (!sessionUserId) {
        return c.json({ error: "User not authenticated" }, 401);
      }

      if (sessionUserId !== userId) {
        return c.json({ error: "Forbidden" }, 403);
      }

      const result = await db
        .update(schema.user)
        .set({
          role: "user",
        })
        .where(eq(schema.user.id, sessionUserId))
        .returning();

      return c.json(result[0]);
    }
  )
  .put(
    "/updateroletoartist/:id",
    zValidator("param", userIdParamSchema),
    async (c) => {
      const sessionUserId = c.var.user?.id;
      const { id: userId } = c.req.valid("param");

      if (!sessionUserId) {
        return c.json({ error: "User not authenticated" }, 401);
      }

      if (sessionUserId !== userId) {
        return c.json({ error: "Forbidden" }, 403);
      }

      const result = await db
        .update(schema.user)
        .set({
          role: "artist",
        })
        .where(eq(schema.user.id, sessionUserId))
        .returning();

      return c.json(result[0]);
    }
  )
  .put(
    "/updaterole/:id",
    zValidator("param", userIdParamSchema),
    zValidator("json", roleUpdateSchema),
    async (c) => {
      const sessionUserId = c.var.user?.id;
      const { id: userId } = c.req.valid("param");
      const data = c.req.valid("json");

      if (!sessionUserId) {
        return c.json({ error: "User not authenticated" }, 401);
      }

      if (sessionUserId !== userId) {
        return c.json({ error: "Forbidden" }, 403);
      }

      const result = await db
        .update(schema.user)
        .set({
          role: data.role,
        })
        .where(eq(schema.user.id, sessionUserId))
        .returning();

      return c.json(result[0]);
    }
  )
  .put(
    "/updateonboardinginfo/:id",
    zValidator("param", userIdParamSchema),
    zValidator("json", onbFormUpdateSchema),
    async (c) => {
      const sessionUserId = c.var.user?.id;
      const { id: userId } = c.req.valid("param");
      const data = c.req.valid("json");

      if (!sessionUserId) {
        return c.json({ error: "User not authenticated" }, 401);
      }

      if (sessionUserId !== userId) {
        return c.json({ error: "Forbidden" }, 403);
      }

      const result = await db
        .update(schema.user)
        .set({
          phone: data.phone,
          location: data.location,
        })
        .where(eq(schema.user.id, sessionUserId))
        .returning();

      return c.json(result[0]);
    }
  );

export default app;
