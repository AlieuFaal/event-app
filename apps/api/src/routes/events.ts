import { Hono } from "hono";
import {
  db,
  eventSchema,
  schema,
  eq,
  and,
  eventInsertSchema,
} from "@vibespot/database";
import { auth, AuthType } from "@vibespot/database/src/auth";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const app = new Hono<{ Variables: AuthType }>()
  .get("/", async (c) => {
    const userId = c.var.user?.id;
    // if (!userId) {
    //   console.log("No user in session.");
    //   throw new Error("User not authenticated");
    // }
    const events = await db.select().from(schema.event);
    return c.json(events);
  })
  .get("/:id", async (c) => {
    const eventId = c.req.param("id");
    const userId = c.var.user?.id;
    // if (!userId) {
    //   console.log("No user in session.");
    //   throw new Error("User not authenticated");
    // }
    const eventById = await db
      .select()
      .from(schema.event)
      .where(eq(schema.event.id, eventId!))
      .limit(1)
      .then((res) => res[0]);
    return c.json(eventById);
  })
  .post(
    "/favorites/:eventId",
    zValidator("param", z.object({ eventId: z.uuidv4() })),
    zValidator("json", eventInsertSchema),
    async (c) => {
      const { eventId } = c.req.valid("param");
      const eventData = c.req.valid("json");

      const [isFavoriteExisting] = await db
        .select()
        .from(schema.favoriteEvent)
        .where(
          and(
            eq(schema.favoriteEvent.userId, eventData.userId),
            eq(schema.favoriteEvent.eventId, eventId)
          )
        )
        .limit(1);

      if (isFavoriteExisting) {
        console.error("Event already exists in favorites for this user.");
        return c.json(isFavoriteExisting);
      }

      const newFavorite = await db
        .insert(schema.favoriteEvent)
        .values({
          userId: eventData.userId,
          eventId: eventId,
          createdAt: new Date(),
        })
        .returning();

      console.log("Added event to users favorites:", newFavorite);
      return c.json(newFavorite);
    }
  )
  .delete(
    "/favorites/:eventId",
    zValidator("param", z.object({ eventId: z.uuidv4() })),
    zValidator("json", eventInsertSchema),
    async (c) => {
      const { eventId } = c.req.valid("param");
      const userId = c.var.user?.id;

      // if (!userId) {
      //   console.log("No user in session.");
      //   throw new Error("User not authenticated");
      // }

      const deleteResult = await db
        .delete(schema.favoriteEvent)
        .where(
          and(
            eq(schema.favoriteEvent.userId, userId!),
            eq(schema.favoriteEvent.eventId, eventId)
          )
        )
        .returning();

      console.log("Removed event from users favorites:", deleteResult);
      return c.json(deleteResult);
    }
  );

// .post("/:favoriteeventid", zValidator("json", eventSchema), async (c) => {
//   const favoriteEventId = c.req.param("favoriteeventid");
//   const userId = c.var.user?.id;

//   if (!userId) {
//     console.log("No user in session.");
//     throw new Error("User not authenticated");
//   }

//   const [existingFavorite] = await db
//     .select({
//       userId: schema.favoriteEvent.userId,
//       eventId: schema.favoriteEvent.eventId,
//       createdAt: schema.favoriteEvent.createdAt,
//     })
//     .from(schema.favoriteEvent)
//     .where(
//       and(
//         eq(schema.favoriteEvent.userId, userId!),
//         eq(schema.favoriteEvent.eventId, favoriteEventId.id)
//       )
//     )
//     .limit(1);

//   if (existingFavorite) {
//     console.error("Event already exists in favorites for this user.");
//     return existingFavorite;
//   }

//   const newFavorite = await db
//     .insert(schema.favoriteEvent)
//     .values({
//       userId: userId!,
//       eventId: favoriteEventId.id,
//       createdAt: new Date(),
//     })
//     .returning();

//   console.log("Added event to users favorites:", newFavorite);
//   return c.json(newFavorite);
// });

export default app;
