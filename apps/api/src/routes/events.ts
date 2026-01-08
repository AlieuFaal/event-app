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
      console.log("No user in session.");
      return c.json({ error: "User not authenticated" }, 401);
    }

    const events = await db.select().from(schema.event);

    return c.json(events);
  })
  .get("/:id", async (c) => {
    const eventId = c.req.param("id");
    const userId = c.var.user?.id;

    if (!userId) {
      console.log("No user in session.");
      return c.json({ error: "User not authenticated" }, 401);
    }

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

    if (!userId) {
      console.log("No user in session.");
      return c.json({ error: "User not authenticated" }, 401);
    }

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

      if (!userId) {
        console.log("No user in session.");
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

        console.log(
          "Event is already a favorite. Removing event from users favorites:",
          savedEvent
        );
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
  )
  .post("/events", zValidator("json", eventInsertSchema), async (c) => {
    const eventData = c.req.valid("json");

    const userId = c.var.user?.id;

    if (!userId) {
      console.log("No user in session.");
      return c.json({ error: "User not authenticated" }, 401);
    }

    const startDate = new Date(eventData.startDate);
    const endDate = new Date(eventData.endDate);
    const repeatEndDate = eventData.repeatEndDate
      ? new Date(eventData.repeatEndDate)
      : null;

    try {
      if (eventData.repeat === "none" || !eventData.repeat) {
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

        console.log("Inserted new event:", newEvent);

        return c.json(newEvent);
      }

      const repeatGroupId = crypto.randomUUID();

      addInterval(startDate, eventData.repeat);

      const calculatedRepeatEndDate = customRepeatEndDate(
        startDate,
        eventData.repeat,
        repeatEndDate
      );

      const initialRepeatedEvent = await db
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

      console.log("Inserted initial repeated event:", initialRepeatedEvent);
      let nextStartDate = addInterval(startDate, eventData.repeat);
      let nextEndDate = addInterval(endDate, eventData.repeat);

      const repeatedEvents = [];

      while (nextStartDate <= calculatedRepeatEndDate) {
        const repeatedEvent = await db
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

        nextStartDate = addInterval(nextStartDate, eventData.repeat);
        nextEndDate = addInterval(nextEndDate, eventData.repeat);
      }

      console.log("Inserted repeated events:", repeatedEvents);

      return c.json([initialRepeatedEvent, ...repeatedEvents]);
    } catch (error) {
      console.error("Error inserting event:", error);
      return c.json({ error: "Failed to create event" }, 500);
    }
  })
  .delete("/:id", async (c) => {
    const eventId = c.req.param("id");
    const userId = c.var.user?.id;

    if (!userId) {
      console.log("No user in session.");
      return c.json({ error: "User not authenticated" }, 401);
    }

    try {
      const deletedEvent = await db
        .delete(schema.event)
        .where(
          and(eq(schema.event.id, eventId!), eq(schema.event.userId, userId))
        )
        .returning();

      console.log("Deleted event:", deletedEvent);
      return c.json(deletedEvent);
    } catch (error) {
      console.error("Error deleting event:", error);
      return c.json({ error: "Failed to delete event" }, 500);
    }
  });

export default app;
