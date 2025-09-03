import { zodEventSchema } from "@/lib/zodEventSchema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "drizzle";
import { schema } from "drizzle/db";
import { _encode } from "better-auth";

export type Event = z.infer<typeof zodEventSchema>;

export const getEventData = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const events = await db
    .select()
    .from(schema.event)
    .orderBy(schema.event.startDate);

  return events;
});

export const postEventData = createServerFn({ method: "POST" })
  .validator(zodEventSchema)
  .handler(async ({ data }) => {
    const event = await db.insert(schema.event).values({
      title: data.eventTitle,
      description: data.eventDescription,
      location: data.eventLocation,
      startDate: data.eventStartDate,
      endDate: data.eventEndDate,
      userId: data.userId,
      createdAt: new Date(),
    });

    return event;
  });
