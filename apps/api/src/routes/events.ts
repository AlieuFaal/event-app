import { Hono } from "hono";
import { db, schema, eq, and } from "@vibespot/database";
import { eventInsertSchema } from "@vibespot/validation";
import { type AuthType } from "@vibespot/database/src/auth";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import {
  addInterval,
  customRepeatEndDate,
} from "../helpers/repeatedEventHelpers";

const app = new Hono<{ Variables: AuthType }>()
  .get("/", async (c) => {
    const userId = c.var.user?.id;

    if (!userId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const events = await db.select().from(schema.event);

    return c.json(events);
  })
  .get("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
    const { id: eventId } = c.req.valid("param");
    const userId = c.var.user?.id;

    if (!userId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const eventById = await db
      .select()
      .from(schema.event)
      .where(eq(schema.event.id, eventId))
      .limit(1)
      .then((res) => res[0]);
    return c.json(eventById);
  })
  .get(
    "/favorites/:userid",
    zValidator("param", z.object({ userid: z.uuid() })),
    async (c) => {
      const sessionUserId = c.var.user?.id;
      const { userid } = c.req.valid("param");

      if (!sessionUserId) {
        return c.json({ error: "User not authenticated" }, 401);
      }

      if (sessionUserId !== userid) {
        return c.json({ error: "Forbidden" }, 403);
      }

      const favoriteEvents = await db
        .select()
        .from(schema.event)
        .innerJoin(
          schema.favoriteEvent,
          eq(schema.event.id, schema.favoriteEvent.eventId)
        )
        .where(eq(schema.favoriteEvent.userId, sessionUserId));

      return c.json(favoriteEvents);
    }
  )
  .post(
    "/favorites/:eventId",
    zValidator("param", z.object({ eventId: z.uuid() })),
    async (c) => {
      const { eventId } = c.req.valid("param");

      const userId = c.var.user?.id;

      if (!userId) {
        return c.json({ error: "User not authenticated" }, 401);
      }

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

      return c.json(newFavorite);
    }
  )
  .post("/events", zValidator("json", eventInsertSchema), async (c) => {
    const eventData = c.req.valid("json");
    const repeat = eventData.repeat;

    const userId = c.var.user?.id;

    if (!userId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    const repeatEndDate = eventData.repeatEndDate
      ? new Date(eventData.repeatEndDate)
      : null;

    try {
      if (repeat === "none" || !repeat) {
        const newEvent = await db
          .insert(schema.event)
          .values({
            title: eventData.title,
            description: eventData.description,
            venue: eventData.venue,
            address: eventData.address,
            color: eventData.color,
            genre: eventData.genre,
            repeat: "none",
            repeatGroupId: null,
            repeatEndDate: null,
            startDate: startDate,
            endDate: endDate,
            latitude: eventData.latitude,
            longitude: eventData.longitude,
            userId: userId,
            createdAt: new Date(),
            imageUrl: eventData.imageUrl,
          })
          .returning();

        return c.json(newEvent);
      }

      const repeatGroupId = crypto.randomUUID();
      const calculatedRepeatEndDate = customRepeatEndDate(
        startDate,
        repeat,
        repeatEndDate
      );
      const maxOccurrences = 500;
      const repeatedEvents: Array<typeof schema.event.$inferSelect[]> = [];

      const result = await db.transaction(async (tx) => {
        const initialRepeatedEvent = await tx
          .insert(schema.event)
          .values({
            title: eventData.title,
            description: eventData.description,
            venue: eventData.venue,
            address: eventData.address,
            color: eventData.color,
            genre: eventData.genre,
            repeat: eventData.repeat,
            repeatGroupId: repeatGroupId,
            repeatEndDate: calculatedRepeatEndDate,
            startDate: startDate,
            endDate: endDate,
            latitude: eventData.latitude,
            longitude: eventData.longitude,
            userId: userId,
            createdAt: new Date(),
            imageUrl: eventData.imageUrl,
          })
          .returning();

        let nextStartDate = addInterval(startDate, repeat);
        let nextEndDate = addInterval(endDate, repeat);
        let count = 0;

        while (nextStartDate <= calculatedRepeatEndDate && count < maxOccurrences) {
          const repeatedEvent = await tx
            .insert(schema.event)
            .values({
              title: eventData.title,
              description: eventData.description,
              venue: eventData.venue,
              address: eventData.address,
              color: eventData.color,
              genre: eventData.genre,
              repeat: repeat,
              repeatGroupId: repeatGroupId,
              repeatEndDate: calculatedRepeatEndDate,
              startDate: nextStartDate,
              endDate: nextEndDate,
              latitude: eventData.latitude,
              longitude: eventData.longitude,
              userId: userId,
              createdAt: new Date(),
              imageUrl: eventData.imageUrl,
            })
            .returning();

          repeatedEvents.push(repeatedEvent);
          nextStartDate = addInterval(nextStartDate, repeat);
          nextEndDate = addInterval(nextEndDate, repeat);
          count++;
        }

        return [initialRepeatedEvent, ...repeatedEvents];
      });

      return c.json(result);
    } catch (error) {
      console.error("Error inserting event:", error);
      return c.json({ error: "Failed to create event" }, 500);
    }
  })
  .delete("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
    const { id: eventId } = c.req.valid("param");
    const userId = c.var.user?.id;

    if (!userId) {
      return c.json({ error: "User not authenticated" }, 401);
    }

    try {
      const deletedEvent = await db
        .delete(schema.event)
        .where(
          and(eq(schema.event.id, eventId), eq(schema.event.userId, userId))
        )
        .returning();

      return c.json(deletedEvent);
    } catch (error) {
      console.error("Error deleting event:", error);
      return c.json({ error: "Failed to delete event" }, 500);
    }
  });

export default app;
