import { zodEventSchema } from "@/lib/zodEventSchema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "drizzle";
import { schema } from "drizzle/db";
import { _encode } from "better-auth";
import { zodCalendarEventSchema } from "@/lib/zodCalendarEventSchema";
import { eq } from "drizzle-orm";

export type Event = z.infer<typeof zodEventSchema>;
export type CalendarEvent = z.infer<typeof zodCalendarEventSchema>;

// export const getCalendarEventData = createServerFn({
//   method: "GET",
//   response: "data",
// }).handler(async () => {
//   const calendarEvents = await db.select().from(schema.calendar_event);

//   return calendarEvents;
// });

export const getEventData = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const events = await db
    .select()
    .from(schema.event)
    .orderBy(schema.event.startDate);

  const eventsWithStringDates = events.map((event) => ({
    ...event,
    startDate: event.startDate,
    endDate: event.endDate,
  }));

  return eventsWithStringDates;
});

export const postEventData = createServerFn({ method: "POST" })
  .validator(zodEventSchema)
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
  .validator(zodCalendarEventSchema)
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
  .validator(zodCalendarEventSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const deletedCount = await db
      .delete(schema.event)
      .where(eq(schema.event.id, data.id));

    return { deletedCount };
  });

export const postCalendarEventData = createServerFn({ method: "POST" })
  .validator(zodCalendarEventSchema)
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

// export const postCalendarEventData = createServerFn({ method: "POST" })
//   .validator(zodCalendarEventSchema)
//   .handler(async ({ data }) => {
//     const calendarEvent = await db.insert(schema.calendar_event).values({
//       title: data.title,
//       start: data.start,
//       end: data.end,
//     });

//     return calendarEvent;
//   });
