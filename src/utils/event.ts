import { eventInsertSchema, calendarEventSchema } from "drizzle/db/schema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { _encode } from "better-auth";
import { schema } from "drizzle/db";
import { db } from "drizzle";
import { eq } from "drizzle-orm";

export type Event = z.infer<typeof eventInsertSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

export const getEventData = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const events = await db
    .select()
    .from(schema.event)
    .orderBy(schema.event.startDate);

  const eventsWithStringDates = events.map((event: any) => ({
    ...event,
    startDate: event.startDate,
    endDate: event.endDate,
  }));

  return eventsWithStringDates;
});

export const postEventData = createServerFn({ method: "POST" })
  .validator(eventInsertSchema)
  .handler(async ({ data }) => {
    try {
      console.log("Received data:", data);

      const event = await db
        .insert(schema.event)
        .values({
          id: data.id || crypto.randomUUID(),
          title: data.title,
          description: data.description,
          location: data.location,
          color: data.color,
          startDate: data.startDate,
          endDate: data.endDate,
          userId: data.userId,
          createdAt: new Date(),
        })
        .returning();

      return event;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw error;
    }
  });

export const putEventData = createServerFn({ method: "POST" })
  .validator(calendarEventSchema)
  .handler(async ({ data }) => {
    const updatedEvent = await db
      .update(schema.event)
      .set({
        title: data.title,
        description: data.description,
        location: data.location,
        color: data.color,
        startDate: data.startDate,
        endDate: data.endDate,
        userId: data.userId,
      })
      .where(eq(schema.event.id, data.id));
    console.log("Updated event:", updatedEvent);
    return updatedEvent;
  });

export const deleteEventData = createServerFn({ method: "POST" })
  .validator(calendarEventSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const deletedCount = await db
      .delete(schema.event)
      .where(eq(schema.event.id, data.id));

    return { deletedCount };
  });

export const postCalendarEventData = createServerFn({ method: "POST" })
  .validator(calendarEventSchema)
  .handler(async ({ data }) => {
    try {
      console.log("Received data:", data);

      const event = await db
        .insert(schema.event)
        .values({
          id: data.id || crypto.randomUUID(),
          title: data.title,
          description: data.description,
          location: data.location,
          color: data.color,
          startDate: data.startDate,
          endDate: data.endDate,
          userId: data.userId,
          createdAt: new Date(),
        })
        .returning();

      return event;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw error;
    }
  });
