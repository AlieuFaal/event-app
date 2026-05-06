import { Hono } from "hono";
import {
  db,
  schema,
  onbFormUpdateSchema,
  roleUpdateSchema,
  eq,
  userFormSchema,
} from "@vibespot/database";
import { type AuthType } from "@vibespot/database/src/auth";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const userIdParamSchema = z.object({
  id: z.uuid(),
});

const sanitizeUserForViewer = (
  user: typeof schema.user.$inferSelect,
  viewerId: string,
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
  .get("/:id/followers", zValidator("param", userIdParamSchema), async (c) => {
    const sessionUserId = c.var.user?.id;
    const { id: userId } = c.req.valid("param");

    if (!sessionUserId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const followers = await db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        image: schema.user.image,
        bio: schema.user.bio,
      })
      .from(schema.followersTable)
      .innerJoin(
        schema.user,
        eq(schema.followersTable.followerId, schema.user.id),
      )
      .where(eq(schema.followersTable.userId, userId));

    return c.json(followers);
  })
  .get("/:id/following", zValidator("param", userIdParamSchema), async (c) => {
    const sessionUserId = c.var.user?.id;
    const { id: userId } = c.req.valid("param");

    if (!sessionUserId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const following = await db
      .select({
        id: schema.user.id,
        name: schema.user.name,
        image: schema.user.image,
        bio: schema.user.bio,
      })
      .from(schema.followingTable)
      .innerJoin(
        schema.user,
        eq(schema.followingTable.followingId, schema.user.id),
      )
      .where(eq(schema.followingTable.userId, userId));

    return c.json(following);
  })
  .get("/:id/export", zValidator("param", userIdParamSchema), async (c) => {
    const sessionUserId = c.var.user?.id;
    const { id: userId } = c.req.valid("param");

    if (!sessionUserId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    if (sessionUserId !== userId) {
      return c.json({ error: "Forbidden" }, 403);
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

    const ownedEvents = await db
      .select()
      .from(schema.event)
      .where(eq(schema.event.userId, sessionUserId))
      .orderBy(schema.event.startDate);

    const favoriteEvents = await db
      .select({
        favoriteCreatedAt: schema.favoriteEvent.createdAt,
        eventId: schema.event.id,
        title: schema.event.title,
        description: schema.event.description,
        venue: schema.event.venue,
        address: schema.event.address,
        startDate: schema.event.startDate,
        endDate: schema.event.endDate,
        genre: schema.event.genre,
        color: schema.event.color,
        imageUrl: schema.event.imageUrl,
        ownerId: schema.event.userId,
      })
      .from(schema.favoriteEvent)
      .innerJoin(schema.event, eq(schema.favoriteEvent.eventId, schema.event.id))
      .where(eq(schema.favoriteEvent.userId, sessionUserId))
      .orderBy(schema.favoriteEvent.createdAt);

    return c.json({
      exportedAt: new Date().toISOString(),
      user: userById,
      events: {
        owned: ownedEvents,
        favorites: favoriteEvents,
      },
    });
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
    },
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
    },
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
    },
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
    },
  )
  .put(
    "/updateprofile/:id",
    zValidator("param", userIdParamSchema),
    zValidator("json", userFormSchema),
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
          name: data.name,
          phone: data.phone,
          location: data.location,
          bio: data.bio,
          image: data.image,
        })
        .where(eq(schema.user.id, sessionUserId))
        .returning();

      return c.json(result[0]);
    },
  );

export default app;
