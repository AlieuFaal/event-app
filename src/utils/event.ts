import { zodEventSchema } from "@/lib/zodEventSchema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "drizzle";
import { event, schema } from "drizzle/db";
import { authClient } from "@/lib/auth-client";
import { getCookie } from "@tanstack/react-start/server";
import { _encode } from "better-auth";
import { auth } from "./auth";

export type Event = z.infer<typeof zodEventSchema>;

// export const session = authClient.getSession();

// export const getEventData = createServerFn({
//   method: "GET",
//   response: "data",
// })
//   .validator((zodEventSchema)
//   .handler(async () => {
//     const events = await db.select().from(event);
//     return event;
//   });

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
