import { Hono } from "hono";
import {
  db,
  eventSchema,
  schema,
  eq,
  and,
  eventInsertSchema,
} from "@vibespot/database";
import { AuthType } from "@vibespot/database/src/auth";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const app = new Hono<{ Variables: AuthType }>()
  .get("/", async (c) => {
    const userId = c.var.user?.id;

    // if (!userId) {
    //   console.log("No user in session.");
    //   return c.json({ error: "User not authenticated" }, 401);
    // }

    const events = await db.select().from(schema.event);

    return c.json(events);
  })
  .get("/:id", async (c) => {
    const eventId = c.req.param("id");

    const eventById = await db
      .select()
      .from(schema.event)
      .where(eq(schema.event.id, eventId!))
      .limit(1)
      .then((res) => res[0]);
    return c.json(eventById);
  })
  .get("/favorites/:userid", async (c) => {
    const userId = c.req.param("userid");

    const favoriteEvents = await db
      .select()
      .from(schema.event)
      .innerJoin(
        schema.favoriteEvent,
        eq(schema.event.id, schema.favoriteEvent.eventId)
      )
      .where(eq(schema.favoriteEvent.userId, userId!));

    return c.json(favoriteEvents);
  })
  .post(
    "/favorites/:eventId",
    zValidator("param", z.object({ eventId: z.uuid() })),
    async (c) => {
      const { eventId } = c.req.valid("param");

      const userId = c.var.user?.id;

      // if (!userId) {
      //   return c.json({ error: "User not authenticated" }, 401);
      // }

      const [isFavoriteExisting] = await db
        .select()
        .from(schema.favoriteEvent)
        .where(
          and(
            eq(schema.favoriteEvent.userId, userId),
            eq(schema.favoriteEvent.eventId, eventId)
          )
        )
        .limit(1);

      if (isFavoriteExisting) {
        const savedEvent = await db
          .delete(schema.favoriteEvent)
          .where(
            and(
              eq(schema.favoriteEvent.userId, userId),
              eq(schema.favoriteEvent.eventId, eventId)
            )
          )
          .returning();

        console.log("Event is already a favorite. Removing event from users favorites:", savedEvent);
        return c.json(savedEvent);
      }

      const newFavorite = await db
        .insert(schema.favoriteEvent)
        .values({
          userId: userId,
          eventId: eventId,
          createdAt: new Date(),
        })
        .returning();

      console.log("Added event to users favorites:", newFavorite);
      return c.json(newFavorite);
    }
  );

export default app;
